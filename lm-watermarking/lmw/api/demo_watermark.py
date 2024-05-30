# coding=utf-8
# Copyright 2023 Authors of "A Watermark for Large Language Models" 
# available at https://arxiv.org/abs/2301.10226
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#import os
import argparse
import os
#from argparse import Namespace
from pprint import pprint
from functools import partial

#import numpy # for gradio hot reload
import gradio as gr

import torch

from transformers import (AutoTokenizer,
                          AutoModelForSeq2SeqLM,
                          AutoModelForCausalLM,
                          LogitsProcessorList)

from watermark_processor import WatermarkLogitsProcessor, WatermarkDetector
#from extended_watermark_processor import WatermarkLogitsProcessor, WatermarkDetector

from warnings import filterwarnings

def str2bool(v):
    """Util function for user friendly boolean flag args"""
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')

def parse_args():
    """Command line argument specification"""
    print("[demo_watermark.py] Parseando argumentos...")
    parser = argparse.ArgumentParser(description="A minimum working example of applying the watermark to any LLM that supports the huggingface 🤗 `generate` API")
    '''
    parser.add_argument(
        "--run_gradio",
        type=str2bool,
        default=True,
        help="Whether to launch as a gradio demo. Set to False if not installed and want to just run the stdout version.",
    )
    parser.add_argument(
        "--demo_public",
        type=str2bool,
        default=False,
        help="Whether to expose the gradio demo to the internet.",
    )'''
    parser.add_argument(
        "--model_name_or_path",
        type=str,
        default="facebook/opt-6.7b",
        help="Main model, path to pretrained model or model identifier from huggingface.co/models.",
    )
    parser.add_argument(
        "--prompt_max_length",
        type=int,
        default=None,
        help="Truncation length for prompt, overrides model config's max length field.",
    )
    parser.add_argument(
        "--max_new_tokens",
        type=int,
        default=200,
        help="Maximmum number of new tokens to generate.",
    )
    parser.add_argument(
        "--generation_seed",
        type=int,
        default=123,
        help="Seed for setting the torch global rng prior to generation.",
    )
    parser.add_argument(
        "--use_sampling",
        type=str2bool,
        default=True,
        help="Whether to generate using multinomial sampling.",
    )
    parser.add_argument(
        "--sampling_temp",
        type=float,
        default=0.7,
        help="Sampling temperature to use when generating using multinomial sampling.",
    )
    parser.add_argument(
        "--n_beams",
        type=int,
        default=1,
        help="Number of beams to use for beam search. 1 is normal greedy decoding",
    )
    parser.add_argument(
        "--use_gpu",
        type=str2bool,
        default=True,
        help="Whether to run inference and watermark hashing/seeding/permutation on gpu.",
    )
    parser.add_argument(
        "--seeding_scheme",
        type=str,
        default="simple_1",
        help="Seeding scheme to use to generate the greenlists at each generation and verification step.",
    )
    parser.add_argument(
        "--gamma",
        type=float,
        default=0.25,
        help="The fraction of the vocabulary to partition into the greenlist at each generation and verification step.",
    )
    parser.add_argument(
        "--delta",
        type=float,
        default=2.0,
        help="The amount/bias to add to each of the greenlist token logits before each token sampling step.",
    )
    parser.add_argument(
        "--normalizers",
        type=str,
        default="",
        help="Single or comma separated list of the preprocessors/normalizer names to use when performing watermark detection.",
    )
    parser.add_argument(
        "--ignore_repeated_bigrams",
        type=str2bool,
        default=False,
        help="Whether to use the detection method that only counts each unqiue bigram once as either a green or red hit.",
    )
    parser.add_argument(
        "--detection_z_threshold",
        type=float,
        default=4.0,
        help="The test statistic threshold for the detection hypothesis test.",
    )
    parser.add_argument(
        "--select_green_tokens",
        type=str2bool,
        default=True,
        help="How to treat the permuation when selecting the greenlist tokens at each step. Legacy is (False) to pick the complement/reds first.",
    )
    parser.add_argument(
        "--skip_model_load",
        type=str2bool,
        default=False,
        help="Skip the model loading to debug the interface.",
    )
    parser.add_argument(
        "--seed_separately",
        type=str2bool,
        default=True,
        help="Whether to call the torch seed function before both the unwatermarked and watermarked generate calls.",
    )
    parser.add_argument(
        "--load_fp16",
        type=str2bool,
        default=True,
        help="Whether to run model in float16 precsion.",
    )
    parser.add_argument(
        "--is_decoder_only_model",
        type=str2bool,
        default=True,
        help="Whether the model is a decoder only model.",
    )
    parser.add_argument(
        "--default_prompt",
        type=str,
        default="",
        help="Default prompt to use in the demo.",
    )
    parser.add_argument(#Modelo HuggingFace se está guardando en root -> ./cache es para mantener el modelo en la misma carpeta de la aplicacion
        "--cache_dir",
        type=str,
        default="./cache",
        help="Path to the cache directory for the huggingface model and tokenizer.",
    )
    args = parser.parse_args()
    print("[demo_watermark.py] Argumentos parseados.")
    pprint(args)
    return args

def load_model(args):
    """Load and return the model and tokenizer"""
    print("[demo_watermark.py] (load_model) Cargando modelo y tokenizador...")
    #args.is_seq2seq_model = any([(model_type in args.model_name_or_path) for model_type in ["t5","T0"]])
    #args.is_decoder_only_model = any([(model_type in args.model_name_or_path) for model_type in ["gpt","opt","bloom"]])
    #generar ruta
    local_model = os.path.join(os.path.join(args.cache_dir, "models--"+args.model_name_or_path.replace("/","--")), "snapshots")
    #buscar carpeta con archivos modelo
    if os.path.exists(local_model):
        print("[demo_watermark.py] (load_model) Ruta local existe, posiblemente los archivos estén en caché")
        # Variable to track whether 'config.json' was found
        # We assume that if 'config.json' is found, then the model is found (model) / if 'config_tokenizer.json' is found, then the tokenizer is found (tokenizer)
        print(f"[demo_watermark.py] (load_model) Buscando modelo ('config.json') en: {local_model}")
        config_found = False
        # Search for "config.json" in the specified directory and its subdirectories
        for folder_path, _, files in os.walk(local_model):
            if "config.json" in files:
                config_found = True
                #model_path = os.path.join(folder_path, "config.json")
                model_path = folder_path
                print(f"[demo_watermark.py] (load_model) 'config.json' encontrado en: {model_path}")
        if config_found:
            #return AutoModelForCausalLM.from_pretrained(model_path, **kwargs)
            if args.use_gpu:
                device = "cuda" if torch.cuda.is_available() else "cpu"
                print("[demo_watermark.py] (load_model) Dispositivo: ", device)
                if args.load_fp16:
                    print("[demo_watermark.py] (load_model) Cargando modelo local con float16 y GPU...")
                    model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.float16, device_map='auto', low_cpu_mem_usage=True, offload_folder="offload", offload_state_dict=True)
                    print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
                else:
                    print("[demo_watermark.py] (load_model) Cargando modelo local con GPU...")
                    model = AutoModelForCausalLM.from_pretrained(model_path, device_map='auto', low_cpu_mem_usage=True, offload_folder="offload", offload_state_dict=True)
                    print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
            else: #No deberia caer aqui
                print("[demo_watermark.py] (load_model) Cargando modelo sin GPU...")
                #model = AutoModelForCausalLM.from_pretrained(model_path, low_cpu_mem_usage=True)
                #print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
        else: # no deberia caer aqui
            print(f"[demo_watermark.py] (load_model) Model '{args.model_name_or_path}' no encontrado (no deberia ocurrir)")
            #print("[demo_watermark.py] (load_model) Cargando modelo desde Hugging Face...")
            #model = AutoModelForCausalLM.from_pretrained(args.model_name_or_path, cache_dir=args.cache_dir, low_cpu_mem_usage=True) #Falla, integrar en un try-catch, ejecutar con ruta local despues de la falla (modelo ya estará descargado en caché local)
            #print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
    else: #modelo no esta en caché
        print("[demo_watermark.py] (load_model) Ruta local no existe")
        print("[demo_watermark.py] (load_model) Cargando modelo desde Hugging Face con float16...")
        if args.use_gpu:
            device = "cuda" if torch.cuda.is_available() else "cpu"
            print("[demo_watermark.py] (load_model) Dispositivo: ", device)
            if args.load_fp16:
                print("[demo_watermark.py] (load_model) Cargando modelo desde Hugging Face con float16 y GPU...")
                model = AutoModelForCausalLM.from_pretrained(args.model_name_or_path, torch_dtype=torch.float16, device_map='auto', cache_dir = args.cache_dir, low_cpu_mem_usage=True, offload_folder="offload", offload_state_dict=True)
                print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
            else:
                print("[demo_watermark.py] (load_model) Cargando modelo desde Hugging Face con GPU...")
                model = AutoModelForCausalLM.from_pretrained(args.model_name_or_path, cache_dir = args.cache_dir, low_cpu_mem_usage=True, offload_folder="offload", offload_state_dict=True)
                print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
        print("[demo_watermark.py] (load_model) Modelo cargado: ", model)
    
    '''
    if args.is_seq2seq_model:
        model = AutoModelForSeq2SeqLM.from_pretrained(local_model) if os.path.exists(local_model) else AutoModelForSeq2SeqLM.from_pretrained(args.model_name_or_path, cache_dir = args.cache_dir)
    elif args.is_decoder_only_model:
        if args.load_fp16:
            model = AutoModelForCausalLM.from_pretrained(args.model_name_or_path,torch_dtype=torch.float16, device_map='auto', cache_dir = args.cache_dir)
        else:
            model = AutoModelForCausalLM.from_pretrained(args.model_name_or_path, cache_dir = args.cache_dir)
    else:
        raise ValueError(f"Unknown model type: {args.model_name_or_path}")

    '''
    
    if args.use_gpu:
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print("demo_watermark.py] (load_model) Dispositivo: ", device)
        if args.load_fp16: 
            pass
        else: 
            print("[demo_watermark.py] (load_model) model.to(device)")
            model = model.to(device)
            print(f"[demo_watermark.py] (load_model) model.to(device): {model}")
    else:
        device = "cpu"
    print("[demo_watermark.py] (load_model) Model.eval()")
    model.eval()
    print("[demo_watermark.py] (load_model) model: ", model)
    print("[demo_watermark.py] (load_model) Tokenizador...")
    
    tokenizer = AutoTokenizer.from_pretrained(args.model_name_or_path)
    print("[demo_watermark.py] Modelo y tokenizador cargados.")
    print(f"[demo_watermark.py] Modelo: {model}")
    print(f"[demo_watermark.py] Tokenizador: {tokenizer}")
    print(f"[demo_watermark.py] Dispositivo: {device}")
    return model, tokenizer, device

def generate(prompt, args, model=None, device=None, tokenizer=None):
    """Instatiate the WatermarkLogitsProcessor according to the watermark parameters
       and generate watermarked text by passing it to the generate method of the model
       as a logits processor. """
    
    print(f"Generando con parámetros: {args}")

    watermark_processor = WatermarkLogitsProcessor(vocab=list(tokenizer.get_vocab().values()),
                                                    gamma=args.gamma,
                                                    delta=args.delta,
                                                    seeding_scheme=args.seeding_scheme,
                                                    select_green_tokens=args.select_green_tokens)

    gen_kwargs = dict(max_new_tokens=args.max_new_tokens)

    if args.use_sampling:
        gen_kwargs.update(dict(
            do_sample=True, 
            top_k=0,
            temperature=args.sampling_temp
        ))
    else:
        gen_kwargs.update(dict(
            num_beams=args.n_beams
        ))

    generate_without_watermark = partial(
        model.generate,
        **gen_kwargs
    )
    generate_with_watermark = partial(
        model.generate,
        logits_processor=LogitsProcessorList([watermark_processor]), 
        **gen_kwargs
    )
    if args.prompt_max_length:
        pass
    elif hasattr(model.config,"max_position_embedding"):
        args.prompt_max_length = model.config.max_position_embeddings-args.max_new_tokens
    else:
        args.prompt_max_length = 2048-args.max_new_tokens

    tokd_input = tokenizer(prompt, return_tensors="pt", add_special_tokens=True, truncation=True, max_length=args.prompt_max_length).to(device)
    truncation_warning = True if tokd_input["input_ids"].shape[-1] == args.prompt_max_length else False
    redecoded_input = tokenizer.batch_decode(tokd_input["input_ids"], skip_special_tokens=True)[0]

    torch.manual_seed(args.generation_seed)
    output_without_watermark = generate_without_watermark(**tokd_input)

    # optional to seed before second generation, but will not be the same again generally, unless delta==0.0, no-op watermark
    if args.seed_separately: 
        torch.manual_seed(args.generation_seed)
    output_with_watermark = generate_with_watermark(**tokd_input)

    if args.is_decoder_only_model:
        # need to isolate the newly generated tokens
        output_without_watermark = output_without_watermark[:,tokd_input["input_ids"].shape[-1]:]
        output_with_watermark = output_with_watermark[:,tokd_input["input_ids"].shape[-1]:]

    decoded_output_without_watermark = tokenizer.batch_decode(output_without_watermark, skip_special_tokens=True)[0]
    decoded_output_with_watermark = tokenizer.batch_decode(output_with_watermark, skip_special_tokens=True)[0]
    print("[demo_watermark.py] Generación finalizada.")
    print(f"[demo_watermark.py] Salida sin marca de agua: {decoded_output_without_watermark}")
    print(f"[demo_watermark.py] Salida con marca de agua: {decoded_output_with_watermark}")
    return (redecoded_input,
            int(truncation_warning),
            decoded_output_without_watermark, 
            decoded_output_with_watermark,
            args) 
            # decoded_output_with_watermark)

def format_names(s):
    """Format names for the gradio demo interface"""
    s=s.replace("num_tokens_scored","Tokens Counted (T)")
    s=s.replace("num_green_tokens","# Tokens in Greenlist")
    s=s.replace("green_fraction","Fraction of T in Greenlist")
    s=s.replace("z_score","z-score")
    s=s.replace("p_value","p value")
    s=s.replace("prediction","Prediction")
    s=s.replace("confidence","Confidence")
    return s

def list_format_scores(score_dict, detection_threshold):
    print("[demo_watermark.py] Formateando métricas...")
    """Format the detection metrics into a gradio dataframe input format"""
    lst_2d = []
    # lst_2d.append(["z-score threshold", f"{detection_threshold}"])
    for k,v in score_dict.items():
        if k=='green_fraction': 
            lst_2d.append([format_names(k), f"{v:.1%}"])
        elif k=='confidence': 
            lst_2d.append([format_names(k), f"{v:.3%}"])
        elif isinstance(v, float): 
            lst_2d.append([format_names(k), f"{v:.3g}"])
        elif isinstance(v, bool):
            lst_2d.append([format_names(k), ("Watermarked" if v else "Human/Unwatermarked")])
        else: 
            lst_2d.append([format_names(k), f"{v}"])
    if "confidence" in score_dict:
        lst_2d.insert(-2,["z-score Threshold", f"{detection_threshold}"])
    else:
        lst_2d.insert(-1,["z-score Threshold", f"{detection_threshold}"])
    print("[demo_watermark.py] Métricas formateadas.")
    return lst_2d

def detect(input_text, args, device=None, tokenizer=None):
    print("[demo_watermark.py] Detectando marca de agua...")
    """Instantiate the WatermarkDetection object and call detect on
        the input text returning the scores and outcome of the test"""
    watermark_detector = WatermarkDetector(vocab=list(tokenizer.get_vocab().values()),
                                        gamma=args.gamma,
                                        seeding_scheme=args.seeding_scheme,
                                        device=device,
                                        tokenizer=tokenizer,
                                        z_threshold=args.detection_z_threshold,
                                        normalizers=args.normalizers,
                                        ignore_repeated_bigrams=args.ignore_repeated_bigrams,
                                        select_green_tokens=args.select_green_tokens)
    if len(input_text)-1 > watermark_detector.min_prefix_len:
        score_dict = watermark_detector.detect(input_text)
        # output = str_format_scores(score_dict, watermark_detector.z_threshold)
        output = list_format_scores(score_dict, watermark_detector.z_threshold)
    else:
        # output = (f"Error: string not long enough to compute watermark presence.")
        output = [["Error","string too short to compute metrics"]]
        output += [["",""] for _ in range(6)]
    print("[demo_watermark.py] Detección de marca de agua finalizada.")
    return output

def main(args):
    print("[demo_watermark.py] Iniciando ejecución main...")
    """Run a command line version of the generation and detection operations
        and optionally launch and serve the gradio demo"""
    # Initial arg processing and log
    args.normalizers = (args.normalizers.split(",") if args.normalizers else [])
    print("[demo_watermark.py] Argumentos parseados: ", args)

    if not args.skip_model_load:
        print("[demo_watermark.py] skip_model_load = False")
        model, tokenizer, device = load_model(args)
    else:
        print("[demo_watermark.py] skip_model_load = True (no debería ocurrir)")
        model, tokenizer, device = None, None, None

    # Generate and detect, report to stdout
    if not args.skip_model_load:
        input_text = (
        "The diamondback terrapin or simply terrapin (Malaclemys terrapin) is a "
        "species of turtle native to the brackish coastal tidal marshes of the "
        "Northeastern and southern United States, and in Bermuda.[6] It belongs "
        "to the monotypic genus Malaclemys. It has one of the largest ranges of "
        "all turtles in North America, stretching as far south as the Florida Keys "
        "and as far north as Cape Cod.[7] The name 'terrapin' is derived from the "
        "Algonquian word torope.[8] It applies to Malaclemys terrapin in both "
        "British English and American English. The name originally was used by "
        "early European settlers in North America to describe these brackish-water "
        "turtles that inhabited neither freshwater habitats nor the sea. It retains "
        "this primary meaning in American English.[8] In British English, however, "
        "other semi-aquatic turtle species, such as the red-eared slider, might "
        "also be called terrapins. The common name refers to the diamond pattern "
        "on top of its shell (carapace), but the overall pattern and coloration "
        "vary greatly. The shell is usually wider at the back than in the front, "
        "and from above it appears wedge-shaped. The shell coloring can vary "
        "from brown to grey, and its body color can be grey, brown, yellow, "
        "or white. All have a unique pattern of wiggly, black markings or spots "
        "on their body and head. The diamondback terrapin has large webbed "
        "feet.[9] The species is"
        )

        print("[demo_watermark.py] args.default_prompt is None: ", args.default_prompt is None)
        if args.default_prompt is None:
            args.default_prompt = input_text

        term_width = 80
        print("#"*term_width)
        #print("[demo_watermark.py] Prompt: ", args.default_prompt)
        '''
        print("[demo_watermark.py] Generando marca de agua y texto sin marca de agua (generate)")
        _, _, decoded_output_without_watermark, decoded_output_with_watermark, _ = generate(args.default_prompt, 
                                                                                            args, 
                                                                                            model=model, 
                                                                                            device=device, 
                                                                                            tokenizer=tokenizer)
        print("[demo_watermark.py] Detección sin marca de agua")
        without_watermark_detection_result = detect(decoded_output_without_watermark, 
                                                    args, 
                                                    device=device, 
                                                    tokenizer=tokenizer)
        print("[demo_watermark.py] Detección con marca de agua")
        with_watermark_detection_result = detect(decoded_output_with_watermark, 
                                                 args, 
                                                 device=device, 
                                                 tokenizer=tokenizer)

        print("[demo_watermark.py] Imprimiendo resultados...")
        print("#"*term_width)
        print("Output without watermark:")
        print(decoded_output_without_watermark)
        print("-"*term_width)
        print(f"Detection result @ {args.detection_z_threshold}:")
        pprint(without_watermark_detection_result)
        print("-"*term_width)

        print("#"*term_width)
        print("Output with watermark:")
        print(decoded_output_with_watermark)
        print("-"*term_width)
        print(f"Detection result @ {args.detection_z_threshold}:")
        pprint(with_watermark_detection_result)
        print("-"*term_width)'''
        print("[demo_watermark.py] Detectando texto sin WatermarkLogitsProcessor (raw)")
        raw_detection_result = detect(args.default_prompt, args, device=device, tokenizer=tokenizer)
        print("#"*term_width)
        print("Output for raw text:")
        print(args.default_prompt)
        print("-"*term_width)
        print(f"Detection result @ {args.detection_z_threshold}:")
        pprint(raw_detection_result)
        print("-"*term_width)


    # Launch the app to generate and detect interactively (implements the hf space demo)
    #if args.run_gradio:
        #run_gradio(args, model=model, tokenizer=tokenizer, device=device)
    print("[demo_watermark.py] Generando JSON de salida...")
    '''
    # Create an empty dictionary
    watermark_dict = {}
    non_watermark_dict = {}

    # Loop through each sub-list in the list of lists
    for item in with_watermark_detection_result:
        # Use the first element as the key and the second as the value
        watermark_dict[item[0]] = item[1]

    # Loop through each sub-list in the list of lists
    for item in without_watermark_detection_result:
        # Use the first element as the key and the second as the value
        non_watermark_dict[item[0]] = item[1]
    
    print("[demo_watermark.py] JSON de salida generado: ")
    data = {
        "watermark_result": watermark_dict,
        "non_watermark_result": non_watermark_dict
    }'''
    raw_dict = {}
    for item in raw_detection_result:
        raw_dict[item[0]] = item[1]
    print(raw_dict)
    #print("[demo_watermark.py] Finalizando ejecución main...")
    #return data


if __name__ == "__main__":
    args = parse_args()
    print(args)
    filterwarnings('ignore', category=UserWarning, message='TypedStorage is deprecated')
    main(args)
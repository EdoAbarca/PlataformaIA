import { useState, useRef, useEffect } from "react"
import HamburguesaMenu from "./HamburguesaMenu"

// Profile Dropdown
const ProfileDropDown = (props) => {

    const [state, setState] = useState(false)
    const profileRef = useRef()

    const navigation = [
        { title: "Dashboard", path: "javascript:void(0)" },
        { title: "Settings", path: "javascript:void(0)" },
        { title: "Log out", path: "javascript:void(0)" },
    ]

    
    useEffect(() => {
        const handleDropDown = (e) => {
            if (!profileRef.current.contains(e.target)) setState(false)
        }
        document.addEventListener('click', handleDropDown)
    }, [])

    return (
        <div className={`relative ${props.class}`}>
            <div className="flex items-center space-x-4">
                <button ref={profileRef} className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 ring-2 lg:focus:ring-indigo-600"
                    onClick={() => setState(!state)}
                >
                    <img
                        src="https://randomuser.me/api/portraits/men/46.jpg"
                        className="w-full h-full rounded-full"
                    />
                </button>
                <div className="lg:hidden">
                    <span className="block">Micheal John</span>
                    <span className="block text-sm text-gray-500">john@gmail.com</span>
                </div>
            </div>
            <ul className={`bg-white top-12 right-0 mt-5 space-y-5 lg:absolute lg:border lg:rounded-md lg:text-sm lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
                {
                    navigation.map((item, idx) => (
                        <li>
                            <a key={idx} className="block text-gray-600 lg:hover:bg-gray-50 lg:p-2.5" href={item.path}>
                                {item.title}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default () => {

    const [menuState, setMenuState] = useState(false)

  // Replace javascript:void(0) path with your path
  const navigation = [
      { title: "Customers", path: "javascript:void(0)" },
      { title: "Careers", path: "javascript:void(0)" },
      { title: "Guides", path: "javascript:void(0)" },
      { title: "Partners", path: "javascript:void(0)" },
  ]
    return (
        <nav className="bg-white border-b">
            <div className="flex items-center space-x-8 py-3 px-4 max-w-screen-xl mx-auto md:px-8">
                <div className="flex-none lg:flex-initial">
                    <a href="javascript:void(0)">
                        <h1>PoC AID</h1>
                    </a>
                </div>
                <div className="flex-1 flex items-center justify-between">
                    <div className={`bg-white absolute z-20 w-full top-16 left-0 p-4 border-b lg:static lg:block lg:border-none ${menuState ? '' : 'hidden'}`}>
                        <ul className="mt-12 space-y-5 lg:flex lg:space-x-6 lg:space-y-0 lg:mt-0">
                            {
                                navigation.map((item, idx) => (
                                    <li key={idx} className="text-gray-600 hover:text-gray-900">
                                        <a href={item.path}>
                                            {item.title}
                                        </a>
                                    </li>
                                ))
                            }
                        </ul>
                        <ProfileDropDown 
                            class="mt-5 pt-5 border-t lg:hidden"
                        />
                    </div>
                    <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-6">
                    <HamburguesaMenu/>
                        <ProfileDropDown 
                            class="hidden lg:block"
                        />
                        
                        <button 
                            className="outline-none text-gray-400 block lg:hidden"
                            onClick={() => setMenuState(!menuState)}
                        >

                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
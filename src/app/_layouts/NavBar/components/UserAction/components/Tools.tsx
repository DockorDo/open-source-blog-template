"use client";
import Image from 'next/image';
import React from 'react'
import { AiFillSun, AiOutlineFullscreen, AiOutlineFullscreenExit, AiFillMoon } from "react-icons/ai";
import screenfull from 'screenfull';
import useThemeStore from '@/stores/theme'
import { Theme } from '@/stores/theme'

function toggleTheme(theme: "dark" | "light") {
    document.documentElement.classList.toggle(
        'dark', theme === 'dark' ? true : false
    )
    document.documentElement.classList.toggle(
        'light', theme === 'light' ? true : false
    )
}

export default function Tools() {
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const theme = useThemeStore((state => state.theme));
    const setTheme = useThemeStore((state => state.updateTheme));

    React.useEffect(() => {
        const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
       
        toggleTheme(localStorage.getItem('theme') as Theme || 'dark');
        setTheme(localStorage.getItem('theme') as Theme || 'dark');
        // listen to the theme change
        themeMedia.addEventListener("change", e => {
            if (e.matches) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
            toggleTheme(localStorage.getItem('theme') as Theme || 'dark');
        });
    }, [setTheme]);
    const ToolsItems = [
        {
            icon: theme === 'dark' ? <AiFillMoon /> : <AiFillSun />,
            title: "theme",
            type: theme,
            onClick: (event?: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                const x = event!.clientX;
                const y = event!.clientY;
                const endRadius = Math.hypot(
                    Math.max(x, innerWidth - x),
                    Math.max(y, innerHeight - y)
                );

                let isDark: boolean;

                document.startViewTransition(() => {
                    isDark = document.documentElement.className.split(' ').includes('dark');
                    const localTheme = localStorage.getItem('theme') || 'dark';
                    if(localTheme == 'dark'){
                        document.documentElement.classList.remove("dark")
                        document.documentElement.classList.add("light")
                    }else{
                        document.documentElement.classList.remove("light")
                        document.documentElement.classList.add("dark")
                    }
                 
                    setTheme(localTheme as Theme == "dark"? "light" : "dark");
                    console.log("theme",theme)
                    localStorage.setItem('theme', localTheme === 'dark' ? 'light' : 'dark');
                }).ready.then(() => {
                    const clipPath = [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ];
                    document.documentElement.animate(
                        {
                            clipPath: isDark ? clipPath.reverse() : clipPath,
                        },
                        {
                            duration: 800,
                            easing: "ease-out",
                            pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)"
                        }
                    )
                })
            },
        },
        {
            icon: (isFullscreen: boolean) => isFullscreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />,
            title: "fullscreen",
            onClick: () => {
                if (screenfull.isEnabled) {
                    screenfull.toggle();
                    setIsFullscreen(!isFullscreen);
                }
            }
        }
    ];
    return (
        <ul className=' sm:flex hidden items-center space-x-2'>
            {
                ToolsItems.map((item, id) => (
                    <li key={id} className={[
                        "bg-white/50 p-2 rounded-full hover:bg-white/70 text-black"
                    ].join(' ')}
                        onClick={(e) => {
                            item.onClick(e);
                        }}
                    >{
                            typeof item.icon === "function" ? item.icon(isFullscreen) : item.icon
                        }</li>
                ))
            }
            <li>
                <a href="https://github.com/yungu-2201999">
                    <Image
                        src="https://avatars.githubusercontent.com/u/168718552?v=4"
                        priority
                        width={35}
                        height={35}
                        className='rounded-full select-none'
                        alt="Picture of the author"
                    />
                </a>
            </li>
        </ul>
    )
}

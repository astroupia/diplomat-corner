import MaxWidthWrapper from "./MaxWidthWrapper"
import Link from "next/link";
import React from "react"; 
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const NavBar =async ()=>{
    const {getUser} = getKindeServerSession()
    const user = await getUser()
    const isAdmin = user?.email ===process.env.ADMIN_EMAIL
return(
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 p-6 w-full border-b border-green-300 border-2 rounded-3xl bg-white/75 backdrop-blur-lg transition-all pt-5  text-3xl" >

        <MaxWidthWrapper>

            <div className="flex h-4 items-center justify-between ">
                    <Link href='/' className='flex z-40 font-semibold '>
                    Diplomat <span className="text-green-600">Corner</span>
                    </Link>

                    <div className="h-full flex items-center space-x-4 ">
                        {
                        user? (
                            <>
                            <Link href='/api/auth/logout' className={buttonVariants({
                                size:'sm',
                                variant:'ghost',

                            })}>
                                Sign out
                            </Link>


                            {isAdmin? <Link href='/api/auth/logout' className={buttonVariants({
                                size:'sm',
                                variant:'ghost',

                            })}>
                                Dashbord ✨
                            </Link>: null }

                            <Link href='/configer/upload' className={buttonVariants({
                                size:'sm',
                                className:"hidden sm:flex gap-1 items-center px-4"

                            })}>
                                Get Started
                                <ArrowRight className="ml-1.5 h-5 w-5 "/>
                            </Link>
                            </>
                        ):(
                        <>
                            <Link href='/api/auth/register' className={buttonVariants({
                                size:'sm',
                                variant:'ghost',

                            })}>
                                Sign up
                            </Link>

                            <Link href='/api/auth/login' className={buttonVariants({
                                size:'sm',
                                variant:'ghost',

                            })}>
                                Log in 
                                <ArrowRight className="ml-1.5 h-5 w-5 "/>
                            </Link>

                            <div className="h-8 w-px bg-zinc-300 hidden sm:block"/>

                            <Link href='/configer/upload' className={buttonVariants({
                                size:'sm',
                                className:"hidden sm:flex gap-1 items-center font-bold "

                            })}>
                                Get Started
                                <ArrowRight className="ml-1.5 h-5 w-5 "/>
                            </Link>


                            </>)
                        }


                    </div>


                </div>


            </MaxWidthWrapper>

        </nav>
)



}

export default NavBar 
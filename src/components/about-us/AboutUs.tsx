import MaxWidthWrapper from "@/components/MaxWidthWrapper"; 
import React from 'react';
import CardAbout from "./CardAbout";
import ContactForm from './ContactForm';
        

const AboutUs: React.FC = () => {
        
        return (
            <div className="bg-white" >
        
        
        
        
        {/*Text Section About Us*/}
        <section className="bg-slate-100">
        <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center p-6 sm:p-12">
            <h2 className="text-4xl sm:text-5xl font-semibold mb-6 text-center text-primary" >
            WHO WE ARE
            </h2>
            <p className="text-[#9F9E9E] leading-relaxed text-lg sm:text-xl px-4 sm:px-14 text-center">
            Diplomat Corner has been serving the diplomatic community in Ethiopia since 2015, providing a wide range of services, including property management, 
            house hunting, disposal of duty-free vehicles, car rental services, used household items sales, liaison services, online shopping, and more. Our commitment 
            to value creation and excellent customer service has grown our subscriber base to over 3,200, consisting of embassies, UN agencies, AU organs, international organizations, 
            and multinational companies.
            </p>
        </div>
        </MaxWidthWrapper>
    </section>

    <section>
        <MaxWidthWrapper>
            <CardAbout/>
        </MaxWidthWrapper>
    </section>

    <section>
        <MaxWidthWrapper>
            <ContactForm/>
        </MaxWidthWrapper>
    </section>
    
    </div>
    );
};
export default AboutUs;




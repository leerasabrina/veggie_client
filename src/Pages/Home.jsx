import Banner from "../Components/Banner";
import Faq from "../Components/Faq";
import HighlightAdvertisement from "../Components/HighlightAdvertisement";
import Newsletter from "../Components/Newsletter";
import Product from "../Components/Product";
import Review from "../Components/Review";
import WhyChooseUs from "../Components/WhyChooseUs";
import ContactUs from "./ContactUs";

const Home = () => {
    return (
        <div>
           <Banner></Banner>
           <Product></Product>
           <HighlightAdvertisement></HighlightAdvertisement>
           <Review></Review>
           <Faq></Faq>
           <WhyChooseUs></WhyChooseUs> 
           <Newsletter></Newsletter>
           <ContactUs></ContactUs>
           
        </div>
    );
};

export default Home;
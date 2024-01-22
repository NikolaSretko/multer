import GalleryList from "../components/Gallery/GalleryList";
import Footer from "../components/shared/Footer/Footer";
import Header from "../components/shared/Header/Header";

const Home = () => {
    return ( 
        <>
            <Header/>
            <main>
            <GalleryList/>
            </main>
            <Footer/>
        </>
     );
}
 
export default Home;
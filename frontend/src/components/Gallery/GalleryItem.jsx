import { Link } from 'react-router-dom';

const GalleryItem = ({ id, title, imageUrl, content }) => {
    const fullImageUrl = `http://localhost:3001${imageUrl}`;

    return (
        <div className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 hover:shadow-xl transition-shadow duration-300">
            <Link to={`/detailpage/${id}`} className="flex flex-col justify-between">
                <img className="rounded-t-lg md:rounded-none md:rounded-l-lg h-64 w-full object-cover" src={fullImageUrl} alt={title} />
                <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
                </div>
            </Link>
        </div>
    );
}

export default GalleryItem;

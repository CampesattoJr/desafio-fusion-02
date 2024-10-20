import { useState, useEffect } from 'react';
import { FaHeart, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Footer } from '../Footer';

export function Home() {
    const [query, setQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');

    const fetchPhotos = async () => {
        try {
            const response = await fetch(`https://picsum.photos/v2/list?page=1&limit=30`);
            if (!response.ok) throw new Error('Erro ao buscar fotos.');
            const data = await response.json();
            setPhotos(data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar fotos:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchPhotos();
        const savedFavorite = JSON.parse(localStorage.getItem('favoritePhotos')) || [];
        setFavorites(savedFavorite);
    }, []);

    const handleSearch = () => {
        // Não há necessidade de buscar novamente da API
        if (query.trim()) {
            // O estado "query" já está sendo atualizado no onChange do input,
            // e as fotos são filtradas diretamente no retorno JSX.
        }
    };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
    };

    const toggleFavorite = (photo) => {
        const updatedFavorites = favorites.some(fav => fav.id === photo.id)
            ? favorites.filter(fav => fav.id !== photo.id) // Remove se já estiver nos favoritos
            : [...favorites, photo]; // Adiciona aos favoritos

        setFavorites(updatedFavorites);
        localStorage.setItem('favoritePhotos', JSON.stringify(updatedFavorites));
    };

    const isFavorite = (photo) => {
        return favorites.some(fav => fav.id === photo.id);
    };

    const categories = ['Natureza', 'Arquitetura', 'Retratos'];
    const colors = ['Preto e Branco', 'Colorido'];

    const applyFilters = (photos) => {
        return photos.filter(photo => {
            const matchesCategory = categoryFilter ? photo.author.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
            const matchesColor = colorFilter ? (colorFilter === 'Preto e Branco' ? photo.id % 2 === 0 : photo.id % 2 !== 0) : true;
            return matchesCategory && matchesColor;
        });
    };

    const filteredPhotos = applyFilters(photos).filter(photo => photo.author.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="bg-[#1f293a] min-h-screen flex flex-col items-center">
            <div className="flex items-center justify-center mt-4">
                <h1 className="text-[#94e2e7] text-3xl md:text-4xl lg:text-5xl font-semibold">Galeria de Fotos</h1>
            </div>

            <h2 className="text-[#94e2e7] text-center text-2xl mt-2 font-medium">Frontend Fusion</h2>

            {error && <p className="text-red-500 text-center">{error}</p>} {/* Exibição do erro */}

            <div className="w-full mt-4 px-4 flex items-center justify-center">

                <div className='relative w-[810px] flex items-center justify-center'>
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-transparent border border-[#2c4766] rounded text-[#94e2e7] text-lg focus:border-[#94e2e7] h-10 w-full min-w-72 p-2 outline-none relative transition-all duration-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="h-10 w-20 text-[#94e2e7] text-2xl flex items-center justify-center absolute right-0"
                        aria-label="Buscar"
                    >
                        <FaSearch />
                    </button>
                </div>

            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-3 place-items-center">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map(photo => (
                        <div key={photo.id} className="px-3 hover:scale-105 transition duration-300" onClick={() => handlePhotoClick(photo)}>
                            <img src={photo.download_url} alt={photo.author} className="max-w-72 w-full min-w-72 h-48  rounded cursor-pointer" />
                            <p className="text-center text-[#94e2e7] text-lg">{photo.author}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-[#94e2e7] text-center col-span-3 mt-4">Nenhuma foto encontrada com essa pesquisa 📸</p>
                )}
            </div>

            {/* Modal de detalhes da foto */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-6">
                    <div className="bg-[#1f293a] border-[#2c4766] border px-4 py-2 rounded max-w-lg w-full relative">
                        <button onClick={closeModal} className="text-red-500 text-3xl"><IoClose /></button>
                        <img src={selectedPhoto.download_url} alt={selectedPhoto.author} className="w-full h-60 object-cover rounded mb-4" />
                        <p className='text-[#94e2e7]'><strong>Autor:</strong> {selectedPhoto.author}</p>
                        <p className='text-[#94e2e7]'><strong>Dimensões:</strong> {selectedPhoto.width} x {selectedPhoto.height}</p>
                        <p className='text-[#94e2e7]'><strong>ID:</strong> {selectedPhoto.id}</p>
                        <p><a href={selectedPhoto.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver no site</a></p>

                        {/* Botão para adicionar/remover dos favoritos */}
                        <button
                            onClick={() => toggleFavorite(selectedPhoto)}
                            className={`p-2 absolute right-3 bottom-1`}
                        >
                            {
                                isFavorite(selectedPhoto) ?
                                    <div className='text-red-500 text-3xl duration-500'><FaHeart /></div> :
                                    <div className='text-white text-3xl duration-500'><FaHeart /></div>
                            }
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
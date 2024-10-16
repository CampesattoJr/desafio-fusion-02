import { useState, useEffect } from 'react';
export function Home() {
    const [query, setQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [favorite, setFavorite] = useState(null);
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
        const savedFavorite = JSON.parse(localStorage.getItem('favoritePhoto'));
        if (savedFavorite) {
            setFavorite(savedFavorite);
        }
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
        if (favorite && favorite.id === photo.id) {
            setFavorite(null);
            localStorage.removeItem('favoritePhoto');
        } else {
            setFavorite(photo);
            localStorage.setItem('favoritePhoto', JSON.stringify(photo));
        }
    };

    const isFavorite = (photo) => {
        return favorite && favorite.id === photo.id;
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

            <div className="flex items-center justify-center mt-4">
                <input
                    type="text"
                    placeholder="Pesquisar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border border-gray-300 rounded h-10 w-60 p-2 outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 h-10 w-20 bg-blue-500 text-white rounded"
                    aria-label="Buscar"
                >
                    🔍
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-3 place-items-center">
                {filteredPhotos.length > 0 ? (
                    filteredPhotos.map(photo => (
                        <div key={photo.id} className="px-3 hover:scale-105 transition duration-300" onClick={() => handlePhotoClick(photo)}>
                            <img src={photo.download_url} alt={photo.author} className="w-full h-48 object-cover rounded cursor-pointer" />
                            <p className="text-center text-[#94e2e7] text-lg">{photo.author}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-[#94e2e7] text-center col-span-3 mt-4">Nenhuma foto encontrada com essa pesquisa 📸</p>
                )}
            </div>

            {/* Modal de detalhes da foto */}
            {selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-4 rounded max-w-lg w-full">
                        <button onClick={closeModal} className="text-red-500 mb-4">Fechar</button>
                        <img src={selectedPhoto.download_url} alt={selectedPhoto.author} className="w-full h-60 object-cover rounded mb-4" />
                        <p><strong>Autor:</strong> {selectedPhoto.author}</p>
                        <p><strong>Dimensões:</strong> {selectedPhoto.width} x {selectedPhoto.height}</p>
                        <p><strong>ID:</strong> {selectedPhoto.id}</p>
                        <p><a href={selectedPhoto.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Ver no site</a></p>

                        {/* Botão para adicionar/remover dos favoritos */}
                        <button
                            onClick={() => toggleFavorite(selectedPhoto)}
                            className={`mt-4 p-2 rounded ${isFavorite(selectedPhoto) ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        >
                            {isFavorite(selectedPhoto) ? <div className='text-red-500'>Remover dos Favoritos 🌟</div>  : <div className='text-yellow-500'>Adcionar dos Favoritos 🌟</div>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
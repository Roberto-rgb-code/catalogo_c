import { useState, useMemo } from 'react';

const Sidebar = ({ products = [], onSearch, onFilterChange, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState(false);  // Estado para las categorías
  const [openExistence, setOpenExistence] = useState(false);  // Estado para existencia

  // Obtener categorías únicas de los productos
  const uniqueCategories = useMemo(() => {
    return [...new Set(products
      .filter(p => p && p.categorias)
      .map(p => p.categorias))]  // Filtrar categorías
      .filter(Boolean)
      .sort(); // Ordenar las categorías
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const toggleCategories = () => setOpenCategories(prev => !prev);  // Alternar categorías
  const toggleExistence = () => setOpenExistence(prev => !prev);  // Alternar existencia

  return (
    <aside className="w-64 bg-white p-4 shadow-lg">
      {/* Sección de búsqueda */}
      <div>
        <h3 className="text-[#242964] font-medium mb-2">BÚSQUEDA</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-[#242964] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full bg-[#242964] text-white p-2 rounded hover:bg-[#1a1f4d] transition-colors"
          >
            BUSCAR
          </button>
        </form>
      </div>

      {/* Sección de búsqueda avanzada */}
      <div className="mt-6">
        <h3 className="text-[#242964] font-medium mb-2">BÚSQUEDA AVANZADA</h3>
        
        {/* Categorías */}
        <div className="border-t border-gray-200">
          <div 
            onClick={toggleCategories}  // Alternar categorías
            className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50"
          >
            <span className="font-medium">CATEGORÍAS</span>
            <span>{openCategories ? '▼' : '▲'}</span>
          </div>
          
          {openCategories && (
            <div className="pl-4 py-2 space-y-2">
              {isLoading ? (
                <div className="text-gray-500">Cargando categorías...</div>
              ) : uniqueCategories.length > 0 ? (
                <>
                  {/* Opción para mostrar todos los productos */}
                  <div className="py-1">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        className="mr-2"
                        onChange={() => onFilterChange('categorias', '')}
                      />
                      <span className="text-sm">Todas las categorías</span>
                    </label>
                  </div>
                  {/* Lista de categorías */}
                  {uniqueCategories.map((category, index) => (
                    <div key={index} className="py-1">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          className="mr-2"
                          onChange={() => onFilterChange('categorias', category)}
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-gray-500">No hay categorías disponibles.</div>
              )}
            </div>
          )}
        </div>
        
        {/* Existencia */}
        <div className="border-t border-gray-200">
          <div 
            onClick={toggleExistence}  // Alternar existencia
            className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50"
          >
            <span className="font-medium">EXISTENCIA</span>
            <span>{openExistence ? '▼' : '▲'}</span>
          </div>
          
          {openExistence && (
            <div className="pl-4 py-2">
              <select 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-[#242964] focus:border-transparent"
                onChange={(e) => onFilterChange('existencia', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Todos los productos</option>
                <option value="disponible">Disponible</option>
                <option value="agotado">Sin existencias</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

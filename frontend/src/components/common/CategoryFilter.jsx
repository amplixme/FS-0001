import * as Icons from 'lucide-react';

const CATEGORY_ICONS = {
  todas: Icons.Layers,
  devops: Icons.Infinity,
  diseno: Icons.Palette,
  opinion: Icons.MessageSquare,
  programacion: Icons.Code2,
  tecnologia: Icons.Cpu,
  default: Icons.Folder,
};

function CategoryFilter({ categories = [], activeCategory, onSelect }) {
  const renderIcon = (slug, isActive) => {
    if (!slug) {
      const AllIcon = Icons.Layers;
      return (
        <AllIcon
          className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
        />
      );
    }

    const IconComponent =
      CATEGORY_ICONS[slug.toLowerCase()] || CATEGORY_ICONS.default;
    return (
      <IconComponent
        className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
      />
    );
  };

  return (
    <div className="w-full lg:w-64 shrink-0">
      <h2 className="hidden lg:block text-base font-bold text-gray-900 tracking-tight mb-4 px-3">
        Categorías
      </h2>

      <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-hide">
        <button
          onClick={() => onSelect(null)}
          className={`flex items-center justify-between shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all w-auto lg:w-full ${
            !activeCategory
              ? 'bg-white lg:shadow-sm text-blue-600 font-semibold'
              : 'bg-gray-50 lg:bg-transparent text-gray-600 hover:bg-gray-100/70'
          }`}
        >
          <div className="flex items-center gap-3">
            {renderIcon(null, !activeCategory)}
            <span>Todas</span>
          </div>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const postCount = cat._count?.posts ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className={`flex items-center justify-between shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all w-auto lg:w-full ${
                isActive
                  ? 'bg-white lg:shadow-sm text-blue-600 font-semibold'
                  : 'bg-gray-50 lg:bg-transparent text-gray-600 hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                {renderIcon(cat.slug, isActive)}
                <span className={isActive ? 'text-blue-600' : 'text-gray-700'}>
                  {cat.name}
                </span>
              </div>

              {postCount > 0 && (
                <span
                  className={`hidden lg:inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full ml-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {postCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;

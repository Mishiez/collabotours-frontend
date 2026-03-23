import Button from '../common/Button';

export default function CategoryCard({ id, name, icon, color, bgColor }) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-5xl mb-3 transform transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: color }}>
        {name}
      </h3>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: color }}
      >
        Explore →
      </Button>
    </div>
  );
}
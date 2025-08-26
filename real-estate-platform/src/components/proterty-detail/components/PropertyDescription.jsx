const PropertyDescription = ({ description }) => (
  <div className="mt-6">
    <h2 className="text-white text-lg font-semibold mb-2">About this property</h2>
    <p className="text-gray-400 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

export default PropertyDescription;

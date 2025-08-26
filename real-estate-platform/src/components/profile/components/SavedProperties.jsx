import React from "react"; 

const SavedProperties = ({ saved, loading }) => { 
  return ( 
    <div className="mb-10"> 
      <h2 className="text-xl font-semibold mb-4 text-white"> 
        Saved Properties{" "} 
        {saved?.length > 0 && ( 
          <span className="text-sm text-gray-400 ml-2">({saved.length})</span> 
        )} 
      </h2> 

      {loading ? ( 
        <p className="text-gray-400">Loading saved properties...</p> 
      ) : saved?.length === 0 ? ( 
        <p className="text-gray-400">No properties saved yet.</p> 
      ) : ( 
        <div className="flex gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 py-1 px-1"> 
          {saved?.map((item) => { 
            const prop = item.property; 
            return ( 
              <div 
                key={item.id} 
                className="min-w-[150px] bg-[#1f2227] rounded-md shadow hover:shadow-lg transition-transform hover:scale-105 cursor-pointer p-2" 
              > 
                <img 
                  src={ 
                    prop.images?.[0]?.image || 
                    "https://via.placeholder.com/160x120?text=No+Image" 
                  } 
                  alt={prop.title} 
                  className="w-full h-24 object-cover rounded-md mb-2" 
                /> 
                <p className="text-sm text-white text-center truncate"> 
                  {prop.title} 
                </p> 
              </div> 
            ); 
          })} 
        </div> 
      )} 
    </div> 
  ); 
}; 

export default SavedProperties;
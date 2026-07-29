export default function CarGallery({ car }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80';
  const photos = car.photos?.length ? car.photos : [fallbackImage];

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <img src={photos[0]} alt={`${car.make} ${car.model}`} className="h-80 w-full rounded-3xl object-cover shadow-soft" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
      <div className="grid grid-cols-2 gap-3">
        {photos.slice(0, 4).map((photo, index) => (
          <img key={photo + index} src={photo} alt={`${car.make} ${car.model} vue ${index + 2}`} className="h-36 w-full rounded-2xl object-cover" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
        ))}
      </div>
    </div>
  );
}
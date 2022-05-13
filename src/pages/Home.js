const Home = () => {
  const menu = [
    {
      title: 'Bola',
      image: require('./assets/images/sphere.png'),
    },
    {
      title: 'Tabung',
      image: require('./assets/images/cylinder.png'),
    },
    {
      title: 'Prisma',
      image: require('./assets/images/hexagon.png'),
    },
    {
      title: 'Kerucut',
      image: require('./assets/images/cone.png'),
    },
    {
      title: 'Limas',
      image: require('./assets/images/pyramid.png'),
    },
  ];

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Header */}
      <header className="flex flex-col justify-center text-center bg-primary-content pt-8 pb-16">
        <div className="mb-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://api.lorem.space/image/face?hash=3174" />
            </div>
          </div>
        </div>
        <h1 className="font-bold leading-none">Halo, Anggi</h1>
        <p className="text-sm">Mau belajar apa hari ini?</p>
      </header>

      {/* Menu */}
      <section className="p-4">
        <div className="grid grid-cols-2 gap-4 -mt-12">
          <div className="animation col-span-2 flex justify-start items-center bg-white py-4 px-6 shadow rounded-xl">
            <img src={require('./assets/images/book.png')} alt="" className="h-10 mr-4" />
            <h2 className="font-bold leading-none">
              KI/KD
            </h2>
          </div>
          {menu.map((menuI) => (
            <div className="flex flex-col justify-center text-center bg-white py-8 shadow rounded-xl" key={menuI.title}>
              <div className="mb-4">
                <img src={menuI.image} alt={menuI.title} className="inline-flex h-20" />
              </div>
              <h2 className="font-bold leading-none">
                {menuI.title}
              </h2>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
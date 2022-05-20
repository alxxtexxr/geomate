import { Link } from "react-router-dom";

const Home = () => {
  const menu = [
    {
      id: 1,
      title: 'Bola',
      imgSrc: require('../assets/images/sphere.png'),
      linkTo: '/stimulation'
    },
    {
      id: 2,
      title: 'Tabung',
      imgSrc: require('../assets/images/cylinder.png'),
      linkTo: '/stimulation'
    },
    {
      id: 3,
      title: 'Prisma',
      imgSrc: require('../assets/images/hexagon.png'),
      linkTo: '/stimulation'
    },
    {
      id: 4,
      title: 'Kerucut',
      imgSrc: require('../assets/images/cone.png'),
      linkTo: '/stimulation'
    },
    {
      id: 5,
      title: 'Limas',
      imgSrc: require('../assets/images/pyramid.png'),
      linkTo: '/stimulation'
    },
  ];

  return (
    <main className="bg-base-200 min-h-screen">
      {/* Header */}
      <header className="flex flex-col justify-center text-center bg-primary-content pt-8 pb-14">
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
            <img src={require('../assets/images/book.png')} alt="" className="h-10 mr-4" />
            <h2 className="font-bold leading-none">
              KI/KD
            </h2>
          </div>
          {menu.map(({id, title, imgSrc, linkTo}) => (
            <Link to={linkTo} key={id}>
              <div className="flex flex-col justify-center text-center bg-white py-8 shadow rounded-xl" key={title}>
                <div className="mb-4">
                  <img src={imgSrc} alt={title} className="inline-flex h-20" />
                </div>
                <h2 className="font-bold leading-none">
                  {title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
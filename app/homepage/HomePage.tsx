'use client'
const HomePage = () => {
  return (
    <div className='container ' >
      {/* <h1 className="dark:text-blue-200 text-3xl ">BG Vehicle Protection Plan</h1>
      <img src="/BG_logo.webp" alt="BG logo"  className="w-2/3 h-2/3 pt-0.25 m-auto mt-4" /> */}
      <div style={{
        zIndex: -1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(/BGHomepage.png)`,
        backgroundSize: 'cover',
        objectFit: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8, // adjust the opacity value to change the transparency
      }} />
    </div>
  )
}
export default HomePage

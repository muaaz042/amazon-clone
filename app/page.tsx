'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, MapPin, Menu, Search, ShoppingCart, X } from 'lucide-react'

type Tile = { label: string; image: string }
type Panel = { title: string; tiles: Tile[] }

const heroTiles: Tile[] = [
  { label: 'Shop kitchen must-haves', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&q=85' },
  { label: 'Shop all things beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85' },
  { label: 'Start looking sharp', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=900&q=85' },
  { label: 'Toys for little ones', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=900&q=85' },
  { label: 'Level up your PC here', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=900&q=85' },
]

const panels: Panel[] = [
  { title: 'Plug in with our electronics', tiles: [{ label: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' }, { label: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' }, { label: 'Gaming', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80' }, { label: 'Speakers', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80' }] },
  { title: 'Score the top PCs & accessories', tiles: [{ label: 'Desktops', image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&q=80' }, { label: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' }, { label: 'Hard Drives', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80' }, { label: 'PC Accessories', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' }] },
  { title: 'Gear up to get fit', tiles: [{ label: 'Clothing', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' }, { label: 'Trackers', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' }, { label: 'Equipment', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' }, { label: 'Deals', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80' }] },
  { title: 'Apparel under $25', tiles: [{ label: 'Women', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80' }, { label: 'Men', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500&q=80' }, { label: 'Girls', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&q=80' }, { label: 'Boys', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80' }] },
  { title: 'Fantastic Finds for Home', tiles: [{ label: 'Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80' }, { label: 'Home Decor', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80' }, { label: 'Dining', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80' }, { label: 'Smart Home', image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=500&q=80' }] },
  { title: 'Shine brighter with your fashion faves', tiles: [{ label: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80' }, { label: 'Handbags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80' }, { label: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' }, { label: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80' }] },
  { title: 'Unveil your radiance', tiles: [{ label: 'Hair Care', image: 'https://images.unsplash.com/photo-1527799820374-dcf8a0f3f6a1?w=500&q=80' }, { label: 'Fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80' }, { label: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80' }, { label: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80' }] },
  { title: 'Level up your PC here', tiles: [{ label: 'Laptops', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80' }, { label: 'PCs', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&q=80' }, { label: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' }, { label: 'Accessories', image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?w=500&q=80' }] },
  { title: 'Fashion trends in Shoes', tiles: [{ label: "Women's", image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80' }, { label: "Men's", image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' }, { label: "Kids'", image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80' }, { label: 'All shoes', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80' }] },
  { title: 'Home harmony', tiles: [{ label: 'Kitchen essentials', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80' }, { label: 'Home comfort', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80' }, { label: 'Decorate with elegance', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&q=80' }, { label: 'Light it Right', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' }] },
  { title: 'Shoes Under $50', tiles: [{ label: "Women's", image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=500&q=80' }, { label: "Men's", image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80' }, { label: "Girl's", image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80' }, { label: "Boy's", image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80' }] },
  { title: 'What you need for furry friends', tiles: [{ label: 'Dogs', image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=500&q=80' }, { label: 'Cats', image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&q=80' }, { label: 'Small Pets', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&q=80' }, { label: 'Deals', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80' }] },
]

const navItems = ['All', 'Prime Video', 'Coupons', 'Customer Service', "Today's Deals", 'Registry', 'Gift Cards', 'Sell']

export default function Page() {
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState('EN')
  const [heroAtStart, setHeroAtStart] = useState(true)
  const [heroAtEnd, setHeroAtEnd] = useState(false)
  const heroScroller = useRef<HTMLElement>(null)
  const visiblePanels = useMemo(() => query.trim() ? panels.filter(panel => `${panel.title} ${panel.tiles.map(tile => tile.label).join(' ')}`.toLowerCase().includes(query.toLowerCase())) : panels, [query])
  const updateHeroEdges = () => {
    const scroller = heroScroller.current
    if (!scroller) return
    setHeroAtStart(scroller.scrollLeft <= 1)
    setHeroAtEnd(scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1)
  }
  useEffect(() => {
    updateHeroEdges()
    const scroller = heroScroller.current
    scroller?.addEventListener('scroll', updateHeroEdges, { passive: true })
    window.addEventListener('resize', updateHeroEdges)
    return () => {
      scroller?.removeEventListener('scroll', updateHeroEdges)
      window.removeEventListener('resize', updateHeroEdges)
    }
  }, [])
  const scrollHero = (direction: 'left' | 'right') => {
    heroScroller.current?.scrollBy({ left: direction === 'right' ? heroScroller.current.clientWidth * 0.82 : -heroScroller.current.clientWidth * 0.82, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#111]">
      <header className="bg-[#131921] text-white">
        <div className="flex min-h-[64px] items-center gap-3 px-4 lg:px-6">
          <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="rounded border border-transparent p-2 hover:border-white lg:hidden"><Menu /></button>
          <div className="flex shrink-0 items-end text-[30px] font-black leading-none tracking-[-2px]">amazon<span className="ml-0.5 text-[#ff9900]">⌣</span></div>
          <div className="hidden items-center gap-2 leading-tight md:flex"><MapPin size={19} /><div><span className="block text-xs text-[#ddd]">Deliver to</span><b>Pakistan</b></div></div>
          <form onSubmit={e => e.preventDefault()} className="flex min-w-0 flex-1 overflow-hidden rounded-md bg-white text-black"><select aria-label="Search category" className="hidden h-12 bg-[#f3f3f3] px-3 text-sm text-[#555] sm:block"><option>All</option></select><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Amazon" className="min-w-0 flex-1 px-3 text-base outline-none" /><button aria-label="Search" className="grid h-12 w-14 place-items-center bg-[#febd69] hover:bg-[#f3a847]"><Search size={25} /></button></form>
          <button onClick={() => setLanguage(language === 'EN' ? 'اردو' : 'EN')} className="hidden items-center gap-1 text-sm font-bold lg:flex"><span>🇺🇸</span>{language}<ChevronDown size={13} /></button>
          <div className="hidden leading-tight lg:block"><span className="block text-xs">Hello, sign in</span><b>Account & Lists</b></div>
          <div className="hidden leading-tight lg:block"><span className="block text-xs">Returns</span><b>& Orders</b></div>
          <button onClick={() => setCart(cart + 1)} className="relative flex items-end gap-1 rounded p-1 hover:outline hover:outline-1 hover:outline-white"><ShoppingCart size={31} /><b>Cart</b>{cart > 0 && <span className="absolute left-4 top-0 font-bold text-[#f08804]">{cart}</span>}</button>
        </div>
        <nav className="flex items-center gap-6 overflow-x-auto bg-[#232f3e] px-4 py-2 text-sm font-semibold whitespace-nowrap lg:px-6">{navItems.map((item, index) => <button key={item} onClick={() => index === 0 && setMenuOpen(true)} className="hover:outline hover:outline-1 hover:outline-white hover:outline-offset-4">{index === 0 && <Menu size={17} className="mr-1 inline" />}{item}</button>)}</nav>
      </header>

      {menuOpen && <div className="fixed inset-0 z-30 bg-black/60" onClick={() => setMenuOpen(false)}><aside className="h-full w-[min(360px,90vw)] bg-white text-[#111]" onClick={e => e.stopPropagation()}><div className="flex items-center gap-3 bg-[#232f3e] px-7 py-5 text-white"><div className="grid size-8 place-items-center rounded-full bg-white text-[#232f3e]">●</div><b>Hello, sign in</b><button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="ml-auto"><X /></button></div><div className="p-7"><b className="text-lg">Shop by Department</b>{['Electronics', 'Home & Kitchen', 'Clothing', 'Beauty', 'Toys & Games', 'Books'].map(item => <button key={item} onClick={() => setMenuOpen(false)} className="block w-full border-b py-4 text-left text-sm">{item}<ChevronRight className="float-right" size={17} /></button>)}</div></aside></div>}

      <main className="mx-auto max-w-[1900px] px-3 pb-10 pt-3 sm:px-5">
        <section className="relative">
          {!heroAtStart && <button type="button" aria-label="Previous hero cards" onClick={() => scrollHero('left')} className="absolute left-2 top-1/2 z-10 grid size-14 -translate-y-1/2 place-items-center rounded-r-xl border border-[#d5d9d9] bg-white/95 text-[#111] shadow-lg transition hover:bg-white"><ChevronLeft /></button>}
          <section ref={heroScroller} aria-label="Featured shopping departments" className="hero-scroller flex gap-2 overflow-x-auto pb-4">
            {heroTiles.map(tile => <button key={tile.label} className="group relative min-w-[220px] flex-1 overflow-hidden rounded-2xl bg-white text-left shadow-sm sm:min-w-[260px]" onClick={() => setQuery(tile.label.split(' ').slice(-1)[0])}><img src={tile.image} alt="" className="h-[290px] w-full object-cover transition duration-300 group-hover:scale-105 sm:h-[410px]" /><span className="absolute inset-x-4 top-4 text-2xl font-black leading-[1.05] sm:text-3xl">{tile.label}</span></button>)}
          </section>
          {!heroAtEnd && <button type="button" aria-label="Next hero cards" onClick={() => scrollHero('right')} className="absolute right-2 top-1/2 z-10 grid size-14 -translate-y-1/2 place-items-center rounded-l-xl border border-[#d5d9d9] bg-white/95 text-[#111] shadow-lg transition hover:bg-white"><ChevronRight /></button>}
        </section>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visiblePanels.map(panel => <article key={panel.title} className="rounded-xl border border-[#d5d9d9] bg-white p-4 shadow-sm"><button onClick={() => setQuery(panel.title.split(' ')[0])} className="mb-3 flex w-full items-start justify-between text-left text-xl font-black leading-tight hover:text-[#c45500]">{panel.title}<ChevronRight className="shrink-0" /></button><div className="grid grid-cols-2 gap-x-3 gap-y-6">{panel.tiles.map(tile => <button key={tile.label} onClick={() => setQuery(tile.label)} className="text-left text-sm hover:text-[#c45500]"><img src={tile.image} alt="" loading="lazy" className="mb-2 aspect-square w-full rounded-xl object-cover" /><span>{tile.label}</span></button>)}</div></article>)}
        </section>
        {!visiblePanels.length && <div className="rounded-xl bg-white p-12 text-center"><h2 className="text-xl font-bold">No departments found</h2><button onClick={() => setQuery('')} className="mt-3 text-[#007185]">Clear search</button></div>}
        <section className="mt-5 border border-[#d5d9d9] bg-white px-4 py-8 text-center"><h2 className="text-xl font-bold">See personalized recommendations</h2><button className="mt-3 rounded-full bg-[#ffd814] px-20 py-2 text-sm font-semibold">Sign in</button><p className="mt-1 text-xs">New customer? <a className="text-[#007185] underline">Start here.</a></p></section>
      </main>

      <footer className="text-sm text-white"><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full bg-[#37475a] py-5 hover:bg-[#485769]">Back to top</button><div className="bg-[#232f3e] px-8 py-12"><div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 md:grid-cols-4"><div><b>Get to Know Us</b><p className="mt-3 text-[#ddd]">Careers<br />Blog<br />About Amazon<br />Investor Relations<br />Amazon Devices<br />Amazon Science</p></div><div><b>Make Money with Us</b><p className="mt-3 text-[#ddd]">Sell products on Amazon<br />Sell on Amazon Business<br />Become an Affiliate<br />Advertise Your Products<br />Self-Publish with Us</p></div><div><b>Amazon Payment Products</b><p className="mt-3 text-[#ddd]">Amazon Business Card<br />Shop with Points<br />Reload Your Balance<br />Amazon Currency Converter</p></div><div><b>Let Us Help You</b><p className="mt-3 text-[#ddd]">Your Account<br />Your Orders<br />Shipping Rates & Policies<br />Returns & Replacements<br />Help</p></div></div><div className="mt-12 border-t border-[#3a4553] pt-8 text-center"><span className="text-2xl font-black">amazon<span className="text-[#ff9900]">⌣</span></span><span className="ml-10 rounded border border-[#8795a5] px-4 py-2">English</span><span className="ml-2 rounded border border-[#8795a5] px-4 py-2">PKR Pakistani Rupee</span></div></div><div className="bg-[#131a22] px-8 py-10 text-center text-xs text-[#ddd]"><div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-left sm:grid-cols-4 lg:grid-cols-7"><span>Amazon Music<br /><i>Stream millions of songs</i></span><span>Amazon Ads<br /><i>Reach customers</i></span><span>6pm<br /><i>Score deals</i></span><span>IMDb<br /><i>Movies, TV & celebrities</i></span><span>Kindle Direct Publishing<br /><i>Digital publishing</i></span><span>Prime Video Direct<br /><i>Video distribution</i></span><span>Amazon Web Services<br /><i>Scalable cloud</i></span></div><p className="mt-10">Conditions of Use · Privacy Notice · Your Ads Privacy Choices<br />© 1996-2026, Amazon.com, Inc. or its affiliates</p></div></footer>
    </div>
  )
}

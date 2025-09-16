import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { checkAuthOnPageLoad } from '../utils/api.js'

export default function Landing() {
  const [exiting, setExiting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const rootRef = useRef(null)

  function smoothNav(url) {
    setLoading(true)
    setExiting(true)
    setTimeout(()=>{ window.location.href = url }, 600)
  }

  // global smooth scroll in page
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth'
  }

  // Token tekshirish va avtomatik redirect
  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        const result = await checkAuthOnPageLoad()
        
        if (result.shouldRedirect) {
          // Smooth transition bilan redirect qilamiz
          setExiting(true)
          setTimeout(() => {
            window.location.href = result.target
          }, 600)
        } else {
          setCheckingAuth(false)
        }

      } catch (error) {
        console.error('Auth tekshirishda xato:', error)
        setCheckingAuth(false)
      }
    }

    checkAuthAndRedirect()
  }, [])

  useEffect(()=>{
    const root = rootRef.current
    if (!root) return
    const elements = root.querySelectorAll('.js-reveal')
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const el = entry.target
        if (entry.isIntersecting) {
          el.classList.add('on')
        } else {
          el.classList.remove('on')
        }
      })
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
    elements.forEach(el=> io.observe(el))
    return ()=> io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className={`space-y-24 transition-all duration-500 ${exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white js-reveal reveal reveal-up reveal-slow">
        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-green-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-2 gap-10 p-6 md:p-10">
          <div className="space-y-5 js-reveal reveal reveal-up reveal-delay-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 text-green-600 px-3 py-1 text-xs border border-green-500/20">Yangi avlod B2B — qurilish materiallari uchun</div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">Soddalashtirilgan xarid. Aql bilan tanlov. Ishonchli yetkazib beruvchilar.</h1>
            <p className="text-lg text-gray-600">MetoneX — so'rov yuborasiz, bir nechta takliflar keladi, eng yaxshisini tanlab buyurtmani boshqarasiz. Hamma narsa bitta joyda: statuslar, hujjatlar, baholash va xabarlar.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/register" onClick={(e)=>{e.preventDefault(); smoothNav('/register')}} className="btn-primary">Hoziroq boshlash</Link>
              <Link to="/login" onClick={(e)=>{e.preventDefault(); smoothNav('/login')}} className="btn-outline">Allaqachon a’zoman</Link>
            </div>
            <div className="flex items-center gap-6 pt-3">
              <div className="text-sm text-gray-500">7 kun ichida 3× tezroq taklif</div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="text-sm text-gray-500">Baholash va reytinglar orqali sifat nazorati</div>
            </div>
          </div>
          <div className="glass p-6 rounded-[20px] shadow-card js-reveal reveal reveal-right reveal-delay-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">Hero Media</div>
              <div className="h-40 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">Stats</div>
              <div className="col-span-2 h-32 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600">Real vaqtda statuslar • Notifikatsiyalar • Hujjatlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS / TRUST */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center js-reveal reveal reveal-up">
        {[1,2,3,4,5].map(i=> (
          <div key={i} className="glass py-6 rounded-xl text-center text-gray-500">Brend {i}</div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold">Nega biz?</h2>
          <p className="muted">Ehtiyojingiz bo‘yicha so‘rov yarating, bozor sizga keladi. Tez, shaffof, nazoratli.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 js-reveal reveal reveal-up reveal-delay-1">
            <div className="badge mb-3 bg-blue-50 text-blue-600 border-blue-100">Avtomatlashtirish</div>
            <div className="font-semibold text-gray-900 mb-2">Bir bosishda so‘rov</div>
            <p className="muted">Kategoriyalar, byudjet va muddatni kiriting, qolganini tizim avtomatik qiladi. Yetkazib beruvchilar xabardor qilinadi.</p>
          </div>
          <div className="card p-6 js-reveal reveal reveal-up reveal-delay-2">
            <div className="badge mb-3 bg-green-50 text-green-600 border-green-100">Shaffoflik</div>
            <div className="font-semibold text-gray-900 mb-2">Takliflarni taqqoslash</div>
            <p className="muted">Narx, muddat, reyting va sharhlar: barcha parametrlar bo‘yicha solishtiring va eng yaxshisini tanlang.</p>
          </div>
          <div className="card p-6 js-reveal reveal reveal-up reveal-delay-3">
            <div className="badge mb-3 bg-blue-50 text-blue-600 border-blue-100">Nazorat</div>
            <div className="font-semibold text-gray-900 mb-2">Buyurtma boshqaruvi</div>
            <p className="muted">Statuslar, bildirishnomalar, hujjatlar — ish jarayonini bir paneldan kuzating va yakunlang.</p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="grid md:grid-cols-4 gap-6 js-reveal reveal reveal-up">
        {[
          {k:'So‘rov→Taklif', v:'80%+'},
          {k:'TTF-Offer (P90)', v:'≤ 10 min'},
          {k:'Offer→Order', v:'35%'},
          {k:'Yetkazish o‘rtacha', v:'48 soat'},
        ].map((s,i)=> (
          <div key={i} className="glass rounded-xl p-5 text-center js-reveal reveal reveal-up reveal-delay-1">
            <div className="text-2xl font-semibold text-gray-900">{s.v}</div>
            <div className="muted text-sm mt-1">{s.k}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="grid lg:grid-cols-3 gap-6 js-reveal reveal reveal-up">
        {[
          {t:"So‘rov yarating", d:"Material turi, hajm, hudud va byudjet kiriting. Bitta minut — va hammasi tayyor."},
          {t:"Takliflar kelsin", d:"SMS/push orqali xabardor qilingan yetkazib beruvchilar taklif yuboradi."},
          {t:"Tanlang va boshqaring", d:"Eng yaxshi taklif asosida buyurtma ochiladi. Statuslar va bildirishnomalar — nazorat ostida."}
        ].map((x,i)=> (
          <div key={i} className="card p-6 js-reveal reveal reveal-up reveal-delay-1">
            <div className="badge mb-3">{i+1}-qadam</div>
            <div className="font-semibold text-gray-900 mb-2">{x.t}</div>
            <p className="muted">{x.d}</p>
          </div>
        ))}
      </section>

      {/* INFO CARDS GRID */}
      <section className="grid md:grid-cols-3 gap-6 js-reveal reveal reveal-up">
        {[
          {t:'Tez integratsiya', d:"API orqali ERP/CRM bilan tez ulanish"},
          {t:'Real-time bildirishnoma', d:'Email/SMS/Telegram orqali darhol xabar'},
          {t:'Hujjat aylanishi', d:'Shartnoma va schyotlarni bir joyda boshqarish'},
          {t:'Monitoring paneli', d:'So‘rov, taklif va buyurtmalar bo‘yicha metrikalar'},
          {t:'Yetkazib berish nazorati', d:'Geolokatsiya va statuslar bo‘yicha kuzatish'},
          {t:'Reyting va sharh', d:'Yetkazib beruvchi sifati ustidan nazorat'}
        ].map((x,i)=> (
          <div key={i} className="card p-6 js-reveal reveal reveal-up reveal-delay-1">
            <div className="font-semibold text-gray-900 mb-1">{x.t}</div>
            <p className="muted">{x.d}</p>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="space-y-8 js-reveal reveal reveal-up">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold">Mijozlar fikri</h2>
          <p className="muted">Platforma orqali vaqt va xarajatlarimiz ancha kamaydi — tanlov esa osonlashdi.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {n:'Bekzod A.', c:'Inshoot Stroy', t:'MetoneX orqali takliflarni tez taqqoslab, eng ma’qulini tanlaymiz.'},
            {n:'Gulnoza M.', c:'BuildMarket', t:'Hujjatlar va statuslar bir joyda — jarayon shaffof bo‘ldi.'},
            {n:'Javlon S.', c:'Qurilish Plaza', t:'Yetkazib beruvchilarning reytingi qarorni tezlashtiradi.'},
          ].map((x,i)=> (
            <div key={i} className="card p-6 js-reveal reveal reveal-up reveal-delay-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">{x.n.split(' ')[0][0]}</div>
                <div>
                  <div className="font-medium text-gray-900">{x.n}</div>
                  <div className="text-sm muted">{x.c}</div>
                </div>
              </div>
              <p className="text-gray-700">“{x.t}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CARD */}
      <section className="grid lg:grid-cols-2 gap-6 items-stretch js-reveal reveal reveal-up">
        <div className="card overflow-hidden order-1 lg:order-1 js-reveal reveal reveal-left reveal-delay-1">
          <div className="aspect-video w-full h-full">
            <iframe 
              title="MetoneX Map"
              src="https://yandex.com/map-widget/v1/?text=Furqat%20ko%27chasi%2C%20B05%2C%20Toshkent&z=16"
              width="100%" height="100%" frameBorder="0" allowFullScreen
              style={{ border: 0 }}
            />
          </div>
        </div>
        <div className="card p-6 order-2 lg:order-2 js-reveal reveal reveal-right reveal-delay-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Biz bilan bog‘laning</h3>
          <p className="muted mb-4">Savolingiz bormi? Formani to‘ldiring, sizga tez orada javob beramiz.</p>
          <form onSubmit={(e)=>{e.preventDefault(); alert('Xabar yuborildi');}} className="space-y-3">
            <input className="input" placeholder="Ism" />
            <input className="input" placeholder="Telefon (+998 90 123 45 67)" />
            <textarea className="input" rows={4} placeholder="Xabaringiz" />
            <button className="btn-primary w-full">Yuborish</button>
          </form>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="grid md:grid-cols-3 gap-6 js-reveal reveal reveal-up">
        <div className="card p-6 js-reveal reveal reveal-up reveal-delay-1">
          <div className="text-sm text-green-600 mb-1">Bepul</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">0 so‘m</div>
          <p className="muted">So‘rov yaratish, taklif qabul qilish, buyurtma boshqaruvi.</p>
        </div>
        <div className="card p-6 border-green-500/30 js-reveal reveal reveal-up reveal-delay-2">
          <div className="text-sm text-blue-600 mb-1">Pro</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">Tez orada</div>
          <p className="muted">Qiziqarli chempionlar, kengaytirilgan analitika va avtomatlashtirish.</p>
        </div>
        <div className="card p-6 js-reveal reveal reveal-up reveal-delay-3">
          <div className="text-sm text-gray-600 mb-1">Enterprise</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">Bog‘laning</div>
          <p className="muted">Integratsiyalar, SLA va shaxsiy funksiyalar.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="glass rounded-2xl p-8 md:p-12 text-center js-reveal reveal reveal-up reveal-slow">
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Boshlashga tayyormisiz?</h3>
        <p className="muted mt-2">Bir daqiqada ro‘yxatdan o‘ting va birinchi so‘rovingizni yarating.</p>
        <div className="flex gap-3 justify-center mt-4">
          <Link to="/register" onClick={(e)=>{e.preventDefault(); smoothNav('/register')}} className="btn-primary">Ro‘yxatdan o‘tish</Link>
          <Link to="/login" onClick={(e)=>{e.preventDefault(); smoothNav('/login')}} className="btn-outline">Kirish</Link>
        </div>
      </section>
      {(loading || checkingAuth) && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="text-center">
            <div className="h-10 w-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">
              {checkingAuth ? 'Tekshirilmoqda...' : 'Yuklanmoqda...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

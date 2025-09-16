export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-12 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-white font-semibold mb-3">MetoneX</div>
            <p className="text-gray-400">Qurilish materiallari uchun raqobatli marketplace.</p>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Bo'limlar</div>
            <ul className="space-y-2">
              <li><a className="text-gray-400 hover:text-white transition" href="#features">Nega biz?</a></li>
              <li><a className="text-gray-400 hover:text-white transition" href="#pricing">Narxlar</a></li>
              <li><a className="text-gray-400 hover:text-white transition" href="#">Qanday ishlaydi</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Hujjatlar</div>
            <ul className="space-y-2">
              <li><a className="text-gray-400 hover:text-white transition" href="#">Maxfiylik</a></li>
              <li><a className="text-gray-400 hover:text-white transition" href="#">Foydalanish shartlari</a></li>
              <li><a className="text-gray-400 hover:text-white transition" href="#">API</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Aloqa</div>
            <ul className="space-y-2">
              <li><a className="text-gray-400 hover:text-white transition" href="mailto:info@metonex.uz">info@metonex.uz</a></li>
              <li><a className="text-gray-400 hover:text-white transition" href="tel:+998901234567">+998 90 123 45 67</a></li>
              <li className="text-gray-400">Toshkent, Furqat, B05</li>
              <li className="flex gap-3 pt-1">
                <a className="text-gray-400 hover:text-white transition" href="#" aria-label="Telegram">TG</a>
                <a className="text-gray-400 hover:text-white transition" href="#" aria-label="LinkedIn">IN</a>
                <a className="text-gray-400 hover:text-white transition" href="#" aria-label="YouTube">YT</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} MetoneX. Barcha huquqlar himoyalangan.</span>
          <span>Made by Abdulaziz Olimov</span>
        </div>
      </div>
    </footer>
  )
}

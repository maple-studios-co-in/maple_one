import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/70 backdrop-blur-md border border-sand/40 mx-auto mb-3 w-fit shadow-[0_10px_30px_rgba(36,19,16,0.08)]"
    >
      <Sparkles className="w-4 h-4 text-warmGrey" />
      <span className="text-[14px] font-normal text-charcoal">Bespoke Interior Studio</span>
    </motion.div>
  )
}

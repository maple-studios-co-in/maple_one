import { ArrowUpRight } from 'lucide-react'
import { motion } from 'motion/react'

export default function BottomLeftCard() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 right-4 left-auto md:left-6 md:right-auto md:bottom-6 lg:bottom-10 lg:left-10 p-3 md:p-4 lg:p-5 rounded-[1.2rem] md:rounded-[1.5rem] lg:rounded-[2.2rem] bg-ivory/40 border border-sand/35 shadow-[0_18px_50px_rgba(36,19,16,0.14)] backdrop-blur-xl flex flex-col gap-2 lg:gap-3 min-w-[140px] md:min-w-[150px] lg:min-w-[180px] w-fit"
    >
      <div className="flex flex-col">
        <span className="font-display text-3xl md:text-4xl font-normal text-charcoal tracking-[-0.04em]">20+</span>
        <span className="text-[10px] md:text-[12px] font-normal text-deepBrown/60 uppercase tracking-wider">
          Cities Served
        </span>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center bg-ivory rounded-full pl-1.5 pr-5 py-1.5 gap-2 hover:bg-maple-50 transition-colors self-start group"
      >
        <div className="bg-maple-50 p-1 rounded-full flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-warmGrey" />
        </div>
        <span className="text-[14px] font-normal text-charcoal">Start Project</span>
      </motion.button>
    </motion.div>
  )
}

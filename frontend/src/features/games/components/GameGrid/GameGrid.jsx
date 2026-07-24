import { motion } from "framer-motion";
import { GameCard } from "..";
import { fadeInUp } from "@/lib/animations";

const GameGrid = ({ games }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          {...fadeInUp}
          transition={{
            ...fadeInUp.transition,
            delay: index * 0.08,
          }}
        >
          <GameCard game={game} />
        </motion.div>
      ))}
    </div>
  );
};

export default GameGrid;

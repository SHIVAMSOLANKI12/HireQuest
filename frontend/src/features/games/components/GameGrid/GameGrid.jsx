import { motion } from "framer-motion";
import { GameCard } from "..";

const GameGrid = ({ games }) => {
  return (
    <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.08,
            duration: 0.3,
          }}
        >
          <GameCard game={game} />
        </motion.div>
      ))}
    </div>
  );
};

export default GameGrid;

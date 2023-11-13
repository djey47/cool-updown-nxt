interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="w-80 bg-indigo-950 drop-shadow rounded p-2 scale-100">
      { children }
    </div>
  );
}

export default Card;

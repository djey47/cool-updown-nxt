import classNames from 'classnames';

interface DividerProps {
  background?: string;
  direction?: 'horizontal' | 'vertical'
}

const Divider = ({
  background = 'bg-gray-300',
  direction = 'horizontal',
}: DividerProps) => {
  const finalClassNames = classNames(
    'rounded',
    background,
    {
      'w-[2px] h-[90%]': direction === 'vertical',
      'w-[90%] h[-2px]': direction !== 'vertical',
    });
  return (
    <div
      className={finalClassNames}
    />
  );
};

export default Divider;

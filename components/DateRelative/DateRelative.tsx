import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateRelativeProps {
  date: string;
}

const DateRelative: React.FC<DateRelativeProps> = ({ date }) => {
  const parsedDate = new Date(date);

  // Debugging: log the parsed date and the current date
  console.log('Parsed Date:', parsedDate);
  console.log('Current Date:', new Date());

  return (
    <span>
      {formatDistanceToNowStrict(parsedDate, { addSuffix: true, locale: fr })}
    </span>
  );
};

export default DateRelative;

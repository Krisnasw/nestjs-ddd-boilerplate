export default function datetimeResolverUtils(datetime: string | any) {
  if (typeof datetime !== 'string') {
    return datetime;
  }
  const arr = datetime.split(' ');
  if (arr.length === 1) {
    return `${arr[0]} 00:00:00`;
  }
  return datetime;
}

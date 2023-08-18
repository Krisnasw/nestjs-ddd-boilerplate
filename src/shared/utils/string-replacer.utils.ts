export default function stringReplacerUtils(words: string, params: any) {
  const regex = /:(\w+)/g;
  return words.replace(regex, function (match, p1) {
    return params[p1] || ':' + p1;
  });
}

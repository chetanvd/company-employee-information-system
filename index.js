function lengthOfLongestSubstring(s) {
  let stringLength = s.length;
  let maxLength = 0;
  const charMap = new Map();
  let pos = 0;

  for (let i = 0; i < stringLength; i++) {
    if (charMap.has(s[i])) {
      pos = Math.max(charMap.get(s[i]), pos);
    }

    maxLength = Math.max(maxLength, i - pos + 1);
    charMap.set(s[i], i + 1);
  }
  return maxLength;
}

let inputString = 'abcda';
console.log(lengthOfLongestSubstring(inputString));

const generateUserId = () => {
  const timePart = Date.now().toString().slice(-7);
  const randomPart = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `user-${timePart}${randomPart}`;
};

module.exports = generateUserId;

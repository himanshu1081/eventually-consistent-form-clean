
export function mockSubmit(data) {
  return new Promise((resolve, reject) => {
    const random = Math.random();

    if (random < 0.3) {
      setTimeout(() => resolve({ status: 200, data }), 1000);
    } else if (random < 0.6) {
      setTimeout(() => reject({ status: 503 }), 1000);
    } else {
      setTimeout(() => resolve({ status: 200, data }), 5000 + Math.random() * 5000);
    }
  });
}

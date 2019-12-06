import garage from '../assets/data.json';

const garageData = [];
garage.items.forEach(value => {
  if (value.heroImage) {
    const {
      heroImage: {url, id},
      model,
      year,
    } = value;

    garageData.push({url, id, model, year});
  }
});

export default garageData;

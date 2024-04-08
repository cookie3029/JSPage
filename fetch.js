import fetch from "node-fetch";

fetch('https://api.thedogapi.com/v1/breeds')
  .then(response => response.json())
  .then(async data => {
    // [1] 데이터 정상 확인 (파싱된 데이터를 출력)
    // console.log(data);

    // [2] 각 요소에 해당하는 모든 키의 값 출력 (각 요소의 name 만 출력)
    const name = data.map(item => item.name);
    // console.log(name);

    // [3] 각 요소에서 id와 name을 추출하여 새로운 객체 반환
    const idAndName = data.map(item => ({id : item.id, name : item.name}));
    // console.log(idAndName);

    // [4] 이미지 id로 이미지 url 받아오기 (데이터 한번에 한개씩 반환)
    // let images = [];

    // for (const item of data) {
    //   const result = {
    //     id: item.id,
    //     name: item.name,
    //     image_url: await getImageFromImageId(item.reference_image_id)
    //   }

    //   console.log(result);
    //   images.push(result);
    // }

    // [5] 이미지 id로 이미지 url 받아오기 (데이터 한번에 반환)
    const promiseImage = data.map(item => new Promise((resolve, reject) => {
      getImageFromImageId(item.reference_image_id)
        .then((image_url) => {
          resolve({
            id: item.id,
            name: item.name,
            image_url: image_url
        })
      })
    }))

    return Promise.all(promiseImage);
  })
  .catch(err => console.log(err))

  async function getImageFromImageId(referenceImageId) {
    try {
      const responseImage = await fetch(`https://api.thedogapi.com/v1/images/${referenceImageId}`);
      const imageData = await responseImage.json();

      // console.log(imageData);

      return imageData.url;
    } catch (err) {
      console.error(err);
    }
  }
  
const OFF = require( "../util/food_api/food_api");

const foodAPI = new OFF(OFF.Options);


exports.getProducts = async (req, res) => {
    //console.log(req.headers.authorization)

    console.log(req)
    //console.log(req.body.barcode)
    const barcode = parseInt(req.body.barcode)
    //console.log(barcode)
    foodAPI.getProduct(barcode).then(p => {
      //console.log(typeof p)
      //console.log(p['product'])
      //console.log(p)
      //console.log(informacao)

      const informacao = p['product'];

      const nomeP = informacao['product_name_pt']
      const imagemP = informacao['image_front_small_url']
      let obj = {nome : nomeP, imagem: imagemP}

      res.status(201).json(obj)

      //res.status(201).json(informacao['product_name_pt']) retorna nome
    }).catch(error => {
      res.status(500).json({ error: error.message })

    });
}

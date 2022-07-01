var Product = require('../models/product');





exports.addProduct = async (req, res) => {
    //console.log(req.headers.authorization)
    if (req.headers && req.headers.authorization) {
        const produto = await Product.find({ user_id: req.user._id, produto: req.body.produto })
        if (produto.length > 0) {
            const quantity = produto[0].get('quantidade')
            await Product.findOneAndUpdate({ user_id: req.user._id, produto: req.body.produto },
                { quantidade: (req.body.quantidade + quantity), validade: req.body.validade }
                , { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    }).catch(err => {
                        res.status(500).json({ error: err.message })
                    })
        }
        else {
            const newProduct = new Product({ user_id: req.user._id, produto: req.body.produto, validade: req.body.validade, categoria: req.body.categoria, quantidade: req.body.quantidade, lista_compras: false })
            newProduct.save().then(product => {
                res.status(201).json(product)
            }).catch(err => {
                res.status(500).json({ error: err.message })
            })
        }
    }

}

exports.getProducts = async (req, res) => {
    //console.log(req.headers.authorization)
    if (req.headers && req.headers.authorization) {
        await Product.find({ user_id: req.user._id })
            .then(produtos => {
                if (!produtos) { return res.status(404).end(); }
                return res.status(200).json(produtos)
            })
            .catch(err => next(err))
    }

}

exports.changeProductQuantity = async (req, res) => {
    /*console.log(req.body)
    console.log(req.user.id)*/
    if (req.headers && req.headers.authorization) {
        await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
            {
                quantidade: req.body.quantidade
            }, { new: true }).then(
                product => {
                    res.status(201).json(product)
                })
            .catch(err => {
                res.status(500).json({ error: err.message })
            })
    }

}

exports.ProductDelete = async (req, res) => {
    console.log('remover')
    await Product.findOneAndRemove({ user_id: req.user.id, produto: req.body.produto })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Product not found with name " + req.body.produto
                });
            }

            res.send({
                success: true,
                message: "Product successfully deleted!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {

                return res.status(404).send({
                    success: false,
                    message: "Product not found with name " + req.body.produto
                });
            }

            return res.status(500).send({
                success: false,
                message: "Could not delete product with name " + req.body.produto
            });
        });
};

exports.ProductEditList = async (req, res) => {
    console.log("entrei")
    if (req.headers && req.headers.authorization) {
        const produto = await Product.find({ user_id: req.user._id, produto: req.body.produto })
        const lista = produto[0].get('lista_compras')
        console.log(lista)
        await Product.findOneAndUpdate({ user_id: req.user._id, produto: req.body.produto },
            { lista_compras: !lista }
            , { new: true }).then(
                product => {
                    res.status(201).json(product)
                }).catch(err => {
                    res.status(500).json({ error: err.message })
                })
    }
}


//Nome do produto; quantidade; validade; Bebida (Não sei como fazer); tenho de enviar o nome antigo caso ele tenha modificado
exports.changeProduct = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        if (req.body.validade == null && req.body.categoria == null && req.body.novoNome == null) {
            //Modificar só quantidade
            console.log('quantidade')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    quantidade: req.body.quantidade
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if (req.body.quantidade == null && req.body.categoria == null && req.body.novoNome == null) {
            //Modificar só validade
            console.log('validade')

            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    validade: req.body.validade
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if (req.body.quantidade == null && req.body.validade == null && req.body.novoNome == null) {
            //Modificar só categoria
            console.log('categoria')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    categoria: req.body.categoria
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if (req.body.quantidade == null && req.body.validade == null && req.body.categoria == null) {
            //Modificar só nome
            console.log('nome')

            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }

        else if (req.body.novoNome == null && req.body.categoria == null && req.body.quantidade != null && req.body.validade!=null) {
            //Modificar quantidade e validade
            console.log('quantidade e validade')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    quantidade: req.body.quantidade,
                    validade: req.body.validade
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if (req.body.validade == null && req.body.categoria == null && req.body.quantidade != null && req.body.novoNome!=null) {
            //Modificar quantidade e nome
            console.log('quantidade e nome')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    quantidade: req.body.quantidade
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if (req.body.validade == null && req.body.novoNome == null && req.body.quantidade != null && req.body.categoria!=null) {
            //Modificar quantidade e categoria
            console.log('quantidade e categoria')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    quantidade: req.body.quantidade,
                    categoria: req.body.categoria
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if(req.body.validade == null && req.body.novoNome != null && req.body.quantidade != null && req.body.categoria!=null) {
            //Modificar quantidade e categoria e nome
            console.log('quantidade e categoria e nome')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    quantidade: req.body.quantidade,
                    categoria: req.body.categoria
                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if(req.body.validade != null && req.body.novoNome == null && req.body.quantidade != null && req.body.categoria!=null) {
            //Modificar quantidade e categoria e validade
            console.log('quantidade e categoria e validade')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    quantidade: req.body.quantidade,
                    categoria: req.body.categoria,
                    validade: req.body.validade,

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }
        else if(req.body.validade != null && req.body.novoNome != null && req.body.quantidade != null && req.body.categoria==null) {
            //Modificar quantidade e nome e validade
            console.log('quantidade e validade e nome')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    quantidade: req.body.quantidade,
                    validade: req.body.validade

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }





        else if(req.body.validade != null && req.body.novoNome != null && req.body.quantidade == null && req.body.categoria==null) {
            //Modificar validade e nome
            console.log('validade e nome')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    validade: req.body.validade

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }

        else if(req.body.validade != null && req.body.novoNome == null && req.body.quantidade == null && req.body.categoria!=null) {
            //Modificar validade e categoria
            console.log('validade e categoria')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    validade: req.body.validade,
                    categoria: req.body.categoria

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }

        else if(req.body.validade != null && req.body.novoNome != null && req.body.quantidade == null && req.body.categoria!=null) {
            //Modificar validade e categoria e nome 
            console.log('validade e categoria e nome ')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    validade: req.body.validade,
                    categoria: req.body.categoria

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }

        else if(req.body.validade == null && req.body.novoNome != null && req.body.quantidade == null && req.body.categoria!=null) {
            //Modificar nome e categoria
            console.log('nome e categoria ')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    categoria: req.body.categoria

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }

        else if(req.body.validade != null && req.body.novoNome != null && req.body.quantidade != null && req.body.categoria!=null) {
            //Modificar todos
            console.log('todos')
            await Product.findOneAndUpdate({ user_id: req.user.id, produto: req.body.produto },
                {
                    produto: req.body.novoNome,
                    quantidade: req.body.quantidade,
                    validade: req.body.validade,
                    categoria: req.body.categoria

                }, { new: true }).then(
                    product => {
                        res.status(201).json(product)
                    })
                .catch(err => {
                    res.status(500).json({ error: err.message })
                })
        }



    }
}


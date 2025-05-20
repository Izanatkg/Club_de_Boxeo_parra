const Sale = require('../models/saleModel');
const Product = require('../models/productModel');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
  try {
    const { productId, quantity, location } = req.body;
    console.log('Datos recibidos:', { productId, quantity, location });

    const product = await Product.findById(productId);
    if (!product) {
      console.log('Producto no encontrado');
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    console.log('Stock actual:', product.stock);

    // Si el producto es de tipo 'class', no verificamos stock
    if (product.type === 'class') {
      console.log('Producto de tipo clase, no se verifica stock');
      // Usar la ubicación proporcionada o una predeterminada
      const selectedLocation = location || 'Villas del Parque';
      console.log('Ubicación seleccionada para clase:', selectedLocation);
      
      // Para productos tipo clase, no restamos stock, solo registramos la venta
      // Calcular total
      const total = product.price * quantity;

      // Crear venta
      const sale = await Sale.create({
        product: productId,
        quantity,
        total,
        createdBy: req.user.id, // Guardar el ID del usuario que realiza la venta
      });

      console.log('Venta de clase creada:', sale);

      // Devolver la venta con los datos del producto
      const populatedSale = await Sale.findById(sale._id).populate('product', 'name price');
      return res.status(201).json(populatedSale);
    }
    
    // Para otros tipos de productos, verificar stock normalmente
    if (!product.stock || typeof product.stock.get !== 'function') {
      console.log('Error en formato de stock:', product.stock);
      return res.status(400).json({ message: 'Error en el formato del stock' });
    }

    // Si no se especifica ubicación, usar la primera disponible con stock
    let selectedLocation = location;
    if (!selectedLocation) {
      const locations = Array.from(product.stock.keys());
      selectedLocation = locations.find(loc => (product.stock.get(loc) || 0) > 0);
      if (!selectedLocation) {
        console.log('No hay stock disponible en ninguna ubicación');
        return res.status(400).json({ message: 'No hay stock disponible' });
      }
    }

    const currentStock = product.stock.get(selectedLocation) || 0;
    console.log('Stock en ubicación:', { selectedLocation, currentStock });

    // Verificar stock en la ubicación seleccionada
    if (currentStock < quantity) {
      console.log('Stock insuficiente:', { currentStock, requested: quantity });
      return res.status(400).json({ message: 'Stock insuficiente en la ubicación seleccionada' });
    }

    // Calcular total
    const total = product.price * quantity;

    // Crear venta
    const sale = await Sale.create({
      product: productId,
      quantity,
      total,
      createdBy: req.user.id, // Guardar el ID del usuario que realiza la venta
    });

    // Actualizar stock (solo para productos que no son de tipo 'class')
    product.stock.set(selectedLocation, currentStock - quantity);
    await product.save();

    console.log('Venta creada:', sale);
    console.log('Stock actualizado:', product.stock);

    // Devolver la venta con los datos del producto
    const populatedSale = await Sale.findById(sale._id).populate('product', 'name price');
    res.status(201).json(populatedSale);
  } catch (error) {
    console.error('Error en createSale:', error);
    res.status(500).json({ message: 'Error al procesar la venta: ' + error.message });
  }
};

// @desc    Get sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('product', 'name price')
      .populate('createdBy', 'name') // Añadir populate para el campo createdBy
      .sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    console.error('Error en getSales:', error);
    res.status(500).json({ message: 'Error al obtener las ventas' });
  }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, total, notes } = req.body;
    
    // Verificar si la venta existe
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    // Si se cambia la cantidad y es un producto físico (no clase), actualizar el stock
    if (quantity !== sale.quantity) {
      const product = await Product.findById(sale.product);
      
      if (product && product.type !== 'class') {
        // Obtener la ubicación del producto (esto podría necesitar ajustes según tu modelo de datos)
        const locations = Array.from(product.stock.keys());
        const selectedLocation = locations[0]; // Usar la primera ubicación como ejemplo
        
        if (selectedLocation) {
          const currentStock = product.stock.get(selectedLocation) || 0;
          
          // Devolver el stock original
          const stockToReturn = sale.quantity;
          
          // Restar el nuevo stock
          const newStock = currentStock + stockToReturn - quantity;
          
          // Verificar si hay suficiente stock
          if (newStock < 0) {
            return res.status(400).json({ message: 'Stock insuficiente para la actualización' });
          }
          
          // Actualizar el stock
          product.stock.set(selectedLocation, newStock);
          await product.save();
        }
      }
    }
    
    // Actualizar la venta
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      { quantity, total, notes },
      { new: true }
    ).populate('product', 'name price').populate('createdBy', 'name');
    
    res.json(updatedSale);
  } catch (error) {
    console.error('Error en updateSale:', error);
    res.status(500).json({ message: 'Error al actualizar la venta: ' + error.message });
  }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si la venta existe
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    
    // Si es un producto físico (no clase), devolver el stock
    const product = await Product.findById(sale.product);
    
    if (product && product.type !== 'class') {
      // Obtener la ubicación del producto (esto podría necesitar ajustes según tu modelo de datos)
      const locations = Array.from(product.stock.keys());
      const selectedLocation = locations[0]; // Usar la primera ubicación como ejemplo
      
      if (selectedLocation) {
        const currentStock = product.stock.get(selectedLocation) || 0;
        
        // Devolver el stock
        const newStock = currentStock + sale.quantity;
        
        // Actualizar el stock
        product.stock.set(selectedLocation, newStock);
        await product.save();
      }
    }
    
    // Eliminar la venta
    await Sale.findByIdAndDelete(id);
    
    res.json({ id });
  } catch (error) {
    console.error('Error en deleteSale:', error);
    res.status(500).json({ message: 'Error al eliminar la venta: ' + error.message });
  }
};

module.exports = {
  createSale,
  getSales,
  updateSale,
  deleteSale
};

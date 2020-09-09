import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const productsInCart = products.filter(product => {
      if (product.quantity) {
        return product;
      }
    });

    if (productsInCart.length === 0) {
      return formatValue(0);
    }

    const totalValues = productsInCart.map(
      cartProduct => cartProduct.quantity * cartProduct.price,
    );

    const addedValues = totalValues.reduce((sum, total) => sum + total);

    return formatValue(addedValues);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const productQuantity = products
      .map(product => product.quantity)
      .filter(quantity => quantity !== undefined);

    if (productQuantity.length === 0) {
      return 0;
    }

    const totalQuantity = productQuantity.reduce((sum, total) => sum + total);

    return totalQuantity;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;

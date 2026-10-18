window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    const button = document.getElementById("calc-btn");
    const errorElement = document.getElementById("error-message");
    const orderForm = document.getElementById("order-form");
    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");
    const resultElement = document.getElementById("result");

    function calculateOrder() {
        const quantityStr = quantityInput.value.trim();
        const regex = /^[1-9]\d*$/;
        let price = 0;
        let quantity = 0;
        let total = 0;

        errorElement.textContent = "";
        resultElement.textContent = "";

        if (!regex.test(quantityStr)) {
            errorElement.textContent = (
                "Ошибка: введите корректное целое положительное число."
            );
            return;
        }

        quantity = parseInt(quantityStr, 10);
        price = parseInt(productSelect.value, 10);
        total = quantity * price;

        resultElement.textContent = (
            "Итоговая стоимость заказа: "  + total.toLocaleString("ru-RU") +
            " руб."
        );
    }

    if (orderForm !== null) {
        orderForm.addEventListener("submit", function (evt) {
            evt.preventDefault();
            calculateOrder();
        });
    }

    if (button !== null) {
        button.addEventListener("click", calculateOrder);
    }
});

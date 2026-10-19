window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    const errorElement = document.getElementById("error-message");
    const optionsBlock = document.getElementById("options-block");
    const optionsSelect = document.getElementById("service-option");
    const propertyBlock = document.getElementById("property-block");
    const propertyCheckbox = document.getElementById("service-property");
    const quantityInput = document.getElementById("quantity");
    const resultElement = document.getElementById("result");
    const typeRadios = document.querySelectorAll(
        "input[name=\"service-type\"]"
    );

    const servicePrices = {
        type1: 1500,
        type2: 2500,
        type3: 3500
    };

    function updatePrice() {
        const quantityStr = quantityInput.value.trim();
        const regex = /^[1-9]\d*$/;
        let basePrice = 0;
        let extraPrice = 0;
        let quantity = 0;
        let selectedType = "type1";
        let total = 0;

        errorElement.textContent = "";
        resultElement.textContent = "";

        typeRadios.forEach(function (radio) {
            if (radio.checked) {
                selectedType = radio.value;
            }
        });

        if (!regex.test(quantityStr)) {
            errorElement.textContent = (
                "Ошибка: введите корректное целое положительное число."
            );
            return;
        }

        quantity = parseInt(quantityStr, 10);
        basePrice = servicePrices[selectedType];

        if (selectedType === "type2") {
            extraPrice = parseInt(optionsSelect.value, 10);
        }

        if (selectedType === "type3" && propertyCheckbox.checked) {
            extraPrice = parseInt(propertyCheckbox.value, 10);
        }

        total = (basePrice + extraPrice) * quantity;
        resultElement.textContent = (
            "Итоговая стоимость заказа: " + total.toLocaleString("ru-RU") +
            " руб."
        );
    }

    function onTypeChange() {
        let selectedType = "type1";

        typeRadios.forEach(function (radio) {
            if (radio.checked) {
                selectedType = radio.value;
            }
        });

        optionsSelect.selectedIndex = 0;
        propertyCheckbox.checked = false;

        if (selectedType === "type2") {
            optionsBlock.classList.remove("is-hidden");
        } else {
            optionsBlock.classList.add("is-hidden");
        }

        if (selectedType === "type3") {
            propertyBlock.classList.remove("is-hidden");
        } else {
            propertyBlock.classList.add("is-hidden");
        }

        updatePrice();
    }

    typeRadios.forEach(function (radio) {
        radio.addEventListener("change", onTypeChange);
    });

    quantityInput.addEventListener("input", updatePrice);
    optionsSelect.addEventListener("change", updatePrice);
    propertyCheckbox.addEventListener("change", updatePrice);

    updatePrice();
});

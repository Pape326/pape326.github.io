/*jslint browser*/

window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const FORM_ENDPOINT = "https://formcarry.com/s/Wix-1Tj-wBA";
    const MODAL_PARAM = "feedback";
    const MODAL_VALUE = "open";
    const STORAGE_KEY = "task8_feedback_form_data";

    const closeBtn = document.getElementById("close-form-btn");
    const consentInput = document.getElementById("consent");
    const emailInput = document.getElementById("email");
    const feedbackForm = document.getElementById("feedback-form");
    const fullnameInput = document.getElementById("fullname");
    const messageInput = document.getElementById("message");
    const modal = document.getElementById("feedback-modal");
    const openBtn = document.getElementById("open-form-btn");
    const organizationInput = document.getElementById("organization");
    const phoneInput = document.getElementById("phone");
    const statusBox = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    let isModalOpen = false;
    let pushedHistory = false;

    function setStatus(text, type) {
        statusBox.textContent = text;
        statusBox.classList.remove("is-error", "is-success");
        if (type === "success") {
            statusBox.classList.add("is-success");
        } else if (type === "error") {
            statusBox.classList.add("is-error");
        }
    }

    function hasModalParam() {
        const params = new URLSearchParams(window.location.search);
        return params.get(MODAL_PARAM) === MODAL_VALUE;
    }

    function buildModalUrl(shouldOpen) {
        const params = new URLSearchParams(window.location.search);
        let query = "";

        if (shouldOpen) {
            params.set(MODAL_PARAM, MODAL_VALUE);
        } else {
            params.delete(MODAL_PARAM);
        }

        query = params.toString();
        return (
            window.location.pathname +
            (
                query
                ? "?" + query
                : ""
            ) +
            window.location.hash
        );
    }

    function saveFormData() {
        const data = {
            consent: consentInput.checked,
            email: emailInput.value,
            fullname: fullnameInput.value,
            message: messageInput.value,
            organization: organizationInput.value,
            phone: phoneInput.value
        };

        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (ignore) {
            return;
        }
    }

    function restoreFormData() {
        let parsed = null;
        let raw = null;

        try {
            raw = window.localStorage.getItem(STORAGE_KEY);
        } catch (ignore) {
            return;
        }

        if (!raw) {
            return;
        }

        try {
            parsed = JSON.parse(raw);
        } catch (ignore) {
            return;
        }

        if (!parsed || typeof parsed !== "object") {
            return;
        }

        if (typeof parsed.fullname === "string") {
            fullnameInput.value = parsed.fullname;
        }
        if (typeof parsed.email === "string") {
            emailInput.value = parsed.email;
        }
        if (typeof parsed.phone === "string") {
            phoneInput.value = parsed.phone;
        }
        if (typeof parsed.organization === "string") {
            organizationInput.value = parsed.organization;
        }
        if (typeof parsed.message === "string") {
            messageInput.value = parsed.message;
        }
        consentInput.checked = Boolean(parsed.consent);
    }

    function clearFormData() {
        feedbackForm.reset();
        try {
            window.localStorage.removeItem(STORAGE_KEY);
        } catch (ignore) {
            return;
        }
    }

    function showModal() {
        modal.classList.remove("is-hidden");
        document.body.classList.add("modal-open");
        isModalOpen = true;
    }

    function hideModal() {
        modal.classList.add("is-hidden");
        document.body.classList.remove("modal-open");
        isModalOpen = false;
    }

    function openModal() {
        if (isModalOpen) {
            return;
        }

        setStatus("", "");
        showModal();
        window.history.pushState(
            {feedbackOpen: true},
            "",
            buildModalUrl(true)
        );
        pushedHistory = true;
        fullnameInput.focus();
    }

    function closeModal() {
        if (!isModalOpen) {
            return;
        }

        if (pushedHistory) {
            window.history.back();
            return;
        }

        hideModal();
        if (hasModalParam()) {
            window.history.replaceState(
                {feedbackOpen: false},
                "",
                buildModalUrl(false)
            );
        }
    }

    function handleSubmit(evt) {
        const formData = new FormData(feedbackForm);

        evt.preventDefault();

        if (!feedbackForm.reportValidity()) {
            return;
        }

        setStatus("", "");
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправка...";

        window.fetch(FORM_ENDPOINT, {
            body: formData,
            headers: {
                Accept: "application/json"
            },
            method: "POST"
        }).then(function (response) {
            return response.json().catch(function () {
                return {};
            }).then(function (result) {
                const isOkCode = (
                    result.code === undefined || result.code === 200
                );

                if (response.ok && isOkCode) {
                    clearFormData();
                    setStatus(
                        "Сообщение успешно отправлено!",
                        "success"
                    );
                } else {
                    const hasMessage = (
                        typeof result.message === "string" &&
                        result.message.length > 0
                    );
                    setStatus(
                        (
                            hasMessage
                            ? "Ошибка отправки: " + result.message
                            : "Не удалось отправить форму. Попробуйте ещё раз."
                        ),
                        "error"
                    );
                }
            });
        }).catch(function () {
            setStatus(
                "Ошибка сети. Проверьте подключение и попробуйте снова.",
                "error"
            );
        }).finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = "Отправить";
        });
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (evt) {
        if (evt.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", function (evt) {
        if (evt.key === "Escape" && isModalOpen) {
            closeModal();
        }
    });

    window.addEventListener("popstate", function (evt) {
        if (hasModalParam()) {
            pushedHistory = Boolean(evt.state && evt.state.feedbackOpen);
            showModal();
        } else {
            pushedHistory = false;
            hideModal();
        }
    });

    feedbackForm.addEventListener("input", saveFormData);
    feedbackForm.addEventListener("change", saveFormData);
    feedbackForm.addEventListener("submit", handleSubmit);

    restoreFormData();

    if (hasModalParam()) {
        pushedHistory = false;
        showModal();
    }
});

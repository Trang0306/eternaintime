/* =================================
   MOONLIT — EFFECT CONTROLLER
   ================================= */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Hiệu ứng ánh sáng theo con trỏ
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");

    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        glow.style.left = mouseX + "px";
        glow.style.top = mouseY + "px";
    });


    // 2. Tạo sao băng ngẫu nhiên
    function createShootingStar() {
        if (document.hidden) return;

        const star = document.createElement("div");
        star.className = "shooting-star";

        star.style.setProperty(
            "--star-top",
            Math.random() * 45 + "%"
        );

        document.body.appendChild(star);

        star.addEventListener("animationend", () => {
            star.remove();
        });
    }

    function scheduleShootingStar() {
        const delay = 3500 + Math.random() * 5000;

        setTimeout(() => {
            createShootingStar();
            scheduleShootingStar();
        }, delay);
    }

    scheduleShootingStar();


    // 3. Nội dung xuất hiện khi cuộn trang
    const revealElements = document.querySelectorAll(
        ".glass-card, .hobby, .info-item, .quote-card"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");

                        currentObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });

    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    // 4. Chuyển cảnh khi bấm liên kết nội bộ
    document.body.classList.add("page-enter");

    document.querySelectorAll("a[href]").forEach((link) => {

        link.addEventListener("click", (event) => {

            // Bỏ qua các thao tác đặc biệt của trình duyệt
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                link.target === "_blank" ||
                link.hasAttribute("download")
            ) {
                return;
            }

            const url = new URL(link.href, window.location.href);

            // Chỉ tạo chuyển cảnh với trang cùng website
            if (
                url.origin !== window.location.origin ||
                url.pathname === window.location.pathname &&
                url.search === window.location.search &&
                url.hash
            ) {
                return;
            }

            if (url.pathname === window.location.pathname &&
                url.search === window.location.search) {
                return;
            }

            event.preventDefault();

            document.body.classList.add("page-leave");

            setTimeout(() => {
                window.location.href = url.href;
            }, 280);

        });

    });

});

document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("gameBoard");
  const scoreDisplay = document.getElementById("score");
  const timeLeftDisplay = document.getElementById("timeLeft");
  const startButton = document.getElementById("startButton");
  const messageDisplay = document.getElementById("message");

  // Pengaturan Game
  const totalHoles = 9; // Jumlah lubang (3x3 grid)
  const gameDuration = 30; // Durasi game dalam detik
  let score = 0;
  let timeLeft = gameDuration;
  let timerId; // Untuk interval timer game
  let moleTimerId; // Untuk interval munculnya mole
  let lastHole; // Untuk memastikan mole tidak muncul di lubang yang sama berturut-turut
  let isGameRunning = false;

  // Emoji untuk mole
  const moleEmoji = "🐭"; // Bisa diganti dengan gambar juga

  // Fungsi untuk membuat lubang di papan
  function createHoles() {
    gameBoard.innerHTML = ""; // Bersihkan papan
    for (let i = 0; i < totalHoles; i++) {
      const holeElement = document.createElement("div");
      holeElement.classList.add("hole");
      holeElement.id = `hole-${i}`; // Beri ID unik

      const moleElement = document.createElement("div");
      moleElement.classList.add("mole");
      moleElement.textContent = moleEmoji; // Tambahkan emoji mole

      holeElement.appendChild(moleElement);
      holeElement.addEventListener("click", whack); // Tambahkan event click ke lubang
      gameBoard.appendChild(holeElement);
    }
  }

  // Fungsi untuk mendapatkan lubang acak
  function getRandomHole() {
    const holes = document.querySelectorAll(".hole");
    const randomIndex = Math.floor(Math.random() * holes.length);
    const selectedHole = holes[randomIndex];

    // Pastikan mole tidak muncul di lubang yang sama dua kali berturut-turut
    if (selectedHole === lastHole) {
      return getRandomHole();
    }
    lastHole = selectedHole;
    return selectedHole;
  }

  // Fungsi untuk membuat mole muncul
  function appearMole() {
    if (!isGameRunning) return; // Jangan munculkan mole jika game belum berjalan

    const randomHole = getRandomHole();
    const mole = randomHole.querySelector(".mole");

    mole.classList.add("up"); // Tambahkan kelas 'up' agar mole muncul

    // Atur waktu mole akan menghilang
    const randomTime = Math.random() * 1000 + 500; // Antara 500ms dan 1500ms
    setTimeout(() => {
      mole.classList.remove("up"); // Sembunyikan mole
      if (isGameRunning) {
        moleTimerId = setTimeout(appearMole, randomTime); // Buat mole muncul lagi
      }
    }, randomTime);
  }

  // Fungsi yang dipanggil saat lubang diklik
  function whack(event) {
    if (!isGameRunning) return;

    const clickedHole = event.currentTarget; // Lubang yang diklik
    const mole = clickedHole.querySelector(".mole");

    if (mole.classList.contains("up")) {
      // Jika mole sedang muncul
      score++;
      scoreDisplay.textContent = score;
      mole.classList.remove("up"); // Sembunyikan mole setelah dipukul
      // Hentikan timer mole yang sedang berjalan agar mole tidak muncul lagi di lubang ini terlalu cepat
      clearTimeout(moleTimerId);
      // Langsung panggil appearMole untuk memulai siklus baru (lebih responsif)
      moleTimerId = setTimeout(appearMole, 500); // Set timeout yang lebih pendek untuk mole berikutnya
    }
  }

  // Fungsi untuk memulai game
  function startGame() {
    if (isGameRunning) return; // Jangan mulai lagi jika sudah berjalan
    isGameRunning = true;
    score = 0;
    timeLeft = gameDuration;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    messageDisplay.textContent = ""; // Hapus pesan game over
    startButton.textContent = "Game Sedang Berlangsung...";
    startButton.disabled = true; // Nonaktifkan tombol saat game berjalan

    createHoles(); // Buat lubang-lubang game

    // Mulai timer utama game
    timerId = setInterval(() => {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerId);
        clearInterval(moleTimerId); // Hentikan munculnya mole
        endGame();
      }
    }, 1000);

    // Mulai munculnya mole pertama kali
    moleTimerId = setTimeout(appearMole, 1000); // Mole pertama muncul setelah 1 detik
  }

  // Fungsi untuk mengakhiri game
  function endGame() {
    isGameRunning = false;
    startButton.textContent = "Mulai Ulang Game";
    startButton.disabled = false; // Aktifkan kembali tombol
    messageDisplay.textContent = `Waktu Habis! Skor Akhir Anda: ${score}`;
    messageDisplay.style.color = score > 0 ? "#28a745" : "#dc3545"; // Warna pesan sesuai skor

    // Sembunyikan semua mole yang mungkin masih muncul
    document.querySelectorAll(".mole").forEach((mole) => {
      mole.classList.remove("up");
    });
  }

  // Event listener untuk tombol mulai
  startButton.addEventListener("click", startGame);

  // Inisialisasi awal (membuat lubang tanpa game berjalan)
  createHoles();
});

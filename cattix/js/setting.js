import { supabase } from './supabase.js'

// LOAD DATA
async function load() {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    alert("User tidak ditemukan, silakan login ulang")
    window.location.href = "login.html"
    return
  }

  const { data } = await supabase
    .from('store_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  // DEFAULT JIKA BELUM ADA DATA
  if (!data) {
    document.getElementById('name').value = "Cattix Store"
    document.getElementById('address').value = "Alamat toko"
    document.getElementById('phone').value = "08xxxxxxxxxx"
    return
  }

  // ISI DARI DATABASE
  document.getElementById('name').value = data.name || "Cattix Store"
  document.getElementById('address').value = data.address || "Alamat toko"
  document.getElementById('phone').value = data.phone || "08xxxxxxxxxx"
}

// SIMPAN DATA
window.save = async function () {
  const name = document.getElementById('name').value
  const address = document.getElementById('address').value
  const phone = document.getElementById('phone').value

  if (!name || !address || !phone) {
    alert("Semua field wajib diisi")
    return
  }

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  if (!user) {
    alert("User tidak ditemukan")
    return
  }

  // CEK DATA SUDAH ADA ATAU BELUM
  const { data } = await supabase
    .from('store_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (data) {
    // UPDATE
    await supabase
      .from('store_settings')
      .update({
        name,
        address,
        phone
      })
      .eq('user_id', user.id)
  } else {
    // INSERT
    await supabase
      .from('store_settings')
      .insert([{
        user_id: user.id,
        name,
        address,
        phone
      }])
  }

  alert("Berhasil disimpan ✅")
}

// BACK KE KASIR
window.goBack = function () {
  window.location.href = "kasir.html"
}

// INIT
load()
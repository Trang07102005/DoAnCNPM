import React from 'react';

const OurChef = () => {
  // Danh sách đầu bếp tĩnh
  const staticChefs = [
    {
      userId: 1,
      username: "Chef Nguyễn Văn An",
      email: "chef.a@example.com",
      role: "Bếp trưởng",
      imageUrl: "https://pegasus.edu.vn/wp-content/uploads/2025/04/demi-chef-la-gi-00.jpg",
    },
    {
      userId: 2,
      username: "Chef Rafael Leao",
      email: "chef.b@example.com",
      role: "Bếp bánh",
      imageUrl: "https://lenouveauchef.com/cdn/shop/files/501056001_4-side_b2858329-8f8e-4539-9c5c-dcfcef3324a5.webp?v=1751912234",
    },
    {
      userId: 3,
      username: "Chef David Lee",
      email: "david.lee@example.com",
      role: "Sous Chef",
      imageUrl: "https://m.media-amazon.com/images/I/51inS3tsvFL._UY1000_.jpg",
    },
    {
      userId: 4,
      username: "Chef Anna Phạm",
      email: "anna.pham@example.com",
      role: "Pastry Chef",
      imageUrl: "https://cdn.prod.website-files.com/67194e3c7396ac1a904cab49/6839be85d4633238fd332da9_Chef%20Pam.webp",
    },
    {
      userId: 5,
      username: "Chef James Nguyễn",
      email: "james.nguyen@example.com",
      role: "Grill Chef",
      imageUrl: "https://cdn.itm.ac.in/2024/05/blog-chef.webp",
    },
    {
      userId: 6,
      username: "Chef Lily Rose",
      email: "lily.tran@example.com",
      role: "Salad Chef",
      imageUrl: "https://www.baker.edu/wp-content/uploads/what-is-a-sous-chef.jpg",
    },
  ];

  return (
    <>
      {/* Ảnh nền đầu trang */}
      <div
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://kalanidhithemes.com/live-preview/landing-page/restoria/all-demo/Restoria-Defoult-2/images/background/banner-image-5.jpg')",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col justify-center items-center px-4">
          <h1 className="text-white text-4xl font-bold mb-2">ĐỘI NGŨ ĐẦU BẾP</h1>
          <p className="text-neutral-300 text-lg">Những người đứng sau hương vị tuyệt vời</p>
        </div>
      </div>

      {/* Danh sách đầu bếp */}
      <div className="w-full bg-[#0f2a24] py-16 px-4 lg:px-28 md:px-16 sm:px-7">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12">
          {staticChefs.map((chef) => (
            <div
              key={chef.userId}
              className="bg-[#0b1e1b] rounded-t-full rounded-b-xl border border-[#E6B15F] p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              {/* Hình ảnh bo góc trên */}
              <div className="w-[180px] h-[180px] mx-auto mb-4 overflow-hidden rounded-t-full border-4 border-[#E6B15F]">
                <img
                  src={chef.imageUrl || "/default-chef.png"}
                  alt={chef.username}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nội dung */}
              <h3 className="text-white text-xl font-bold">{chef.username}</h3>
              <p className="text-white font-semibold mt-1">{chef.role}</p>
              <p className="text-[#E6B15F]">{chef.email}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OurChef;

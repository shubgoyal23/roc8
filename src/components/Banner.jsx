'use client'

function Banner() {
  return (
    <div className="flex justify-center items-center px-16 py-2.5 w-full text-sm font-medium text-black bg-zinc-100 max-md:px-5 max-md:max-w-full">
    <div className="flex gap-5 items-start">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d0e43c6157dac81b4659d4a258ab52a17e6f73251e43b1bd0dd27e644dbdd6e?apiKey=138a9a05636f4818b7903db304a97a25&"
        className="shrink-0 w-4 aspect-square"
      />
      <div className="flex-auto self-stretch">
        Get 10% off on business sign up
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff3effd7635170030964f3361bea79472b59f0f6634371170e446c93b7552c9e?apiKey=138a9a05636f4818b7903db304a97a25&"
        className="shrink-0 w-4 aspect-square"
      />
    </div>
  </div>
  )
}

export default Banner

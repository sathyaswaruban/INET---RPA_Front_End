import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const testimonials = [
  { img: "images/testimonials/1.png" },
  { img: "images/testimonials/2.png" },
  { img: "images/testimonials/3.png" },
  { img: "images/testimonials/4.png" },
  { img: "images/testimonials/5.png" },
];

// const firstRow = reviews.slice(0, reviews.length / 2);

const ReviewCard = ({ review }: any) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-6">
        <img alt="" src={review.img} />
      </div>
      {/* <blockquote className="mt-2 text-sm">{body}</blockquote> */}
    </figure>
  );
};

export function MarqueeTestimonials({ className = "" }) {
  return (
    <div className={`'relative flex w-full flex-col items-center justify-center overflow-hidden  ${className}`}>
      <h2 data-aos="zoom-out" className="mb-8 text-2xl md:text-6xl font-bold text-gradient">
        Our Testimonials
      </h2>
      <Marquee pauseOnHover className="[--duration:20s]">
        {testimonials.map((testimonial, idx) => (
          <ReviewCard key={idx} review={testimonial} />
        ))}
      </Marquee>
      {/* 
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div> */}
    </div>
  );
}

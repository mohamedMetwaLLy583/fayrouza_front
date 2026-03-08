import Loader from '@/components/Loader';

export default function Loading() {
  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-white/80 backdrop-blur-sm fixed inset-0 z-50">
      <Loader />
    </div>
  );
}

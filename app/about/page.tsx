import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary mb-4">
              About Butterfly Couture
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Redefining luxury fashion through artistry, innovation, and timeless elegance.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-sm flex items-center justify-center">
              <span className="text-foreground/20">Brand Story Image</span>
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-4xl font-bold text-primary">Our Story</h2>
              <p className="text-foreground/70 leading-relaxed">
                Founded in 2018, Butterfly Couture emerged from a passion for creating luxury fashion 
                that transcends trends. Our founders believed that true elegance lies in the details, 
                in the craftsmanship, and in the story each piece tells.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Inspired by the transformative beauty of butterflies, we create pieces that celebrate 
                metamorphosis, grace, and the journey towards one's truest self. Each collection is 
                meticulously curated with the finest materials sourced from around the world.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="font-serif text-4xl font-bold text-primary mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Craftsmanship',
                  description: 'Every piece is a masterpiece of meticulous attention to detail and expert technique.',
                },
                {
                  title: 'Sustainability',
                  description: 'We are committed to ethical sourcing and sustainable production practices.',
                },
                {
                  title: 'Innovation',
                  description: 'We blend timeless elegance with contemporary design to create timeless pieces.',
                },
              ].map((value) => (
                <div key={value.title} className="bg-secondary border border-border rounded-sm p-8 text-center space-y-4">
                  <h3 className="font-semibold text-lg text-primary">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="font-serif text-4xl font-bold text-primary mb-12 text-center">
              Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Isabelle Laurent',
                  role: 'Founder & Creative Director',
                  bio: 'With over 20 years in luxury fashion design.',
                },
                {
                  name: 'Marcus Chen',
                  role: 'Chief Operations Officer',
                  bio: 'Brings expertise in sustainable production.',
                },
                {
                  name: 'Sophie Beaumont',
                  role: 'Head of Collections',
                  bio: 'Award-winning designer with a passion for detail.',
                },
              ].map((member) => (
                <div key={member.name} className="text-center space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-sm flex items-center justify-center mb-4">
                    <span className="text-foreground/20">Photo</span>
                  </div>
                  <h3 className="font-semibold text-lg text-primary">
                    {member.name}
                  </h3>
                  <p className="text-sm text-accent font-medium">
                    {member.role}
                  </p>
                  <p className="text-sm text-foreground/70">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Press */}
          <div className="bg-secondary border border-border rounded-sm p-12 text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-primary">
              Press & Awards
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Butterfly Couture has been featured in leading fashion publications and has received 
              numerous awards for design excellence and sustainability initiatives.
            </p>
            <button className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors">
              View Press Kit
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

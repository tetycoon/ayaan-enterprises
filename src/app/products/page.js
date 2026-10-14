import Link from "next/link";
import { waLink } from "@/lib/config";

export const metadata = {
  title: "New Office Chairs & Chair Spare Parts Supply | Ayaan Enterprises",
  description:
    "Supply of new office chairs, mesh chairs, executive chairs, visitor chairs and chair spare parts: gas lifts, wheels, bases, mechanisms, armrests and foam."
};

export default function ProductsPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <div className="breadcrumb">
              <Link href="/">Home</Link> / Products
            </div>
            <span className="eyebrow">Products we supply</span>
            <h1>New chairs and genuine spare parts for corporate orders</h1>
            <p className="lead">
              When a chair is past repair or you need extra seating, we supply new office chairs and genuine spare
              parts, with installation included.
            </p>
            <div className="btn-row">
              <Link className="btn btn-amber" href="/shop">
                View Chair Catalog
              </Link>
              <a
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
                href={waLink("Hi, I need a price for new chairs / spare parts.")}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          <figure className="img-slot ratio-16x10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/page-products.jpg" alt="Modern office chairs at workstation" />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">New chairs</span>
            <h2>Office seating collections</h2>
          </div>
          <div className="grid g-4">
            <article className="card service-card">
              <figure className="img-slot ratio-1x1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/prod-mesh.jpg" alt="White ergonomic mesh office chair" />
              </figure>
              <div className="body">
                <h3>Ergonomic mesh chairs</h3>
                <p>Breathable mesh back, adjustable lumbar support, synchro tilt.</p>
                <Link className="link-arrow" href="/quote?service=New%20Chairs">
                  Ask price &rarr;
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-1x1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/prod-office.jpg" alt="Fabric swivel workstation chair" />
              </figure>
              <div className="body">
                <h3>Workstation chairs</h3>
                <p>Comfortable fabric revolving chairs for everyday desk use.</p>
                <Link className="link-arrow" href="/quote?service=New%20Chairs">
                  Ask price &rarr;
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-1x1 contain">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/hero-executive.jpg" alt="Executive high-back leather chair" />
              </figure>
              <div className="body">
                <h3>Executive chairs</h3>
                <p>High-back leatherette chairs with chrome accents for cabins.</p>
                <Link className="link-arrow" href="/quote?service=New%20Chairs">
                  Ask price &rarr;
                </Link>
              </div>
            </article>

            <article className="card service-card">
              <figure className="img-slot ratio-1x1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/prod-visitor.jpg" alt="Black cantilever visitor chair" />
              </figure>
              <div className="body">
                <h3>Visitor &amp; training</h3>
                <p>Cantilever, stackable and writing-pad chairs for training rooms.</p>
                <Link className="link-arrow" href="/quote?service=New%20Chairs">
                  Ask price &rarr;
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Spare parts</span>
            <h2>Chair spare parts, supplied and fitted</h2>
            <p>Standard dimensions that fit 95% of office chairs. Buy the part directly or with technician installation.</p>
          </div>
          <div className="grid g-3">
            <article className="card">
              <h3>Gas lifts / cylinders</h3>
              <p>Class 3 &amp; class 4 certified cylinders in standard stroke lengths.</p>
            </article>
            <article className="card">
              <h3>Wheels &amp; castors</h3>
              <p>Heavy-duty nylon and floor-safe PU wheels in 50mm and 60mm pin sizes.</p>
            </article>
            <article className="card">
              <h3>Bases &amp; Star bases</h3>
              <p>Heavy-duty reinforced nylon and polished chrome bases rated up to 135kg.</p>
            </article>
            <article className="card">
              <h3>Tilt mechanisms</h3>
              <p>Push-back, locking tilt and multi-lock synchro mechanisms.</p>
            </article>
            <article className="card">
              <h3>Armrest pairs</h3>
              <p>Fixed T-arms, 1D height adjustable, and 3D multi-directional armrests.</p>
            </article>
            <article className="card">
              <h3>Foam &amp; Fabrics</h3>
              <p>High-density moulded 40+ density foam and anti-microbial fabric rolls.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

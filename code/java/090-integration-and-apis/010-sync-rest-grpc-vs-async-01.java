package ch090;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// REST：最通用的问题——"这张券存在吗？"
// 任何人拿 curl 就能调，这就是它的全部优点，也是它的全部约束。
class SyncRestGrpcVsAsync01 {

    @RestController
    @RequestMapping("/coupons")
    static class CouponController {
        private final CouponStore store;

        CouponController(CouponStore store) {
            this.store = store;
        }

        @GetMapping("/{code}")
        ResponseEntity<Coupon> get(@PathVariable String code) {
            Coupon coupon = store.find(code);
            return coupon == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(coupon);
        }
    }

    interface CouponStore {
        Coupon find(String code);
    }

    record Coupon(String code, int discountPercent) {}
}

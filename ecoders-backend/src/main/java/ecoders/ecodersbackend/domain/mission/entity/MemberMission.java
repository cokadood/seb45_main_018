package ecoders.ecodersbackend.domain.mission.entity;

import ecoders.ecodersbackend.domain.member.entity.Member;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"member_id", "mission_id"})}) //중복방지
@Entity
public class MemberMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "mission_id")
    private Mission mission;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(updatable = false)
    private LocalDateTime modifiedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column
    private Long stamp;

    @Column
    private boolean completed;
}
